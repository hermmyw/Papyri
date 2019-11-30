from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClassInfo, StudentClassRelationship, UserInfo, Lecture, User
from .serializers import ClassSerializer, StudentClassSerializer
from django.core import serializers
from django.http import QueryDict

@api_view(['GET', 'POST'])
def class_list(request):
    """
    List all classes or create a new class
    """

    if request.method == "GET":
        classes = ClassInfo.objects.all()
        print(classes[0].id)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        teacher_id = request.data.get("teacher_id")
        serializer = ClassSerializer(data=request.data)
        user_info = UserInfo.objects.filter(is_student=False).get(owner_id=teacher_id)
        if serializer.is_valid() and user_info:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def class_by_teacher(request, teacher_id):
    """
    Get classes that a teacher teaches
    """

    try:
        classes = ClassInfo.filter(teacher_id=teacher_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_student(request):
    """
    Add a student to a class
    """

    reg_code = request.data.get('code')
    class_object = ClassInfo.objects.get(registration_code=reg_code)
    class_id = class_object.id
    student_id = request.data.get('student_id')
    class_name = class_object.name
    new_request_data = QueryDict(mutable=True)
    new_request_data.update({
        'c_id': str(class_id),
        'student_id': student_id
    })

    already_enrolled = StudentClassRelationship.objects.filter(c_id=class_id, student_id=student_id)
    if already_enrolled:
        return Response({"error": "Student already enrolled in this class"}, status=status.HTTP_400_BAD_REQUEST)
        
    print(new_request_data)
    serializer = StudentClassSerializer(data=new_request_data)
    if serializer.is_valid():
        serializer.save()
        response_data = serializer.data
        response_data['class_name'] = class_name
        return Response(response_data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_classes_by_student(request, student_id):
    """
    Get classes that a student is in
    """

    try:
        classes = ClassInfo.objects.raw("""
            SELECT c.name, c.id, s.student_id
            FROM papyri_classinfo AS c
            JOIN papyri_studentclassrelationship AS s
            ON c.id = s.c_id
            WHERE s.student_id = %s
        """, [student_id])
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ret_data = []
    for c in classes:
        teacher_info = User.objects.get(id=c.teacher.id)
        lecture_info = Lecture.objects.filter(c_id=c.id).order_by('-date')
        ret_data.append({
            'id': c.id,
            'name': c.name,
            'teacher_id': c.teacher.id,
            'teacher_name': teacher_info.first_name + " " + teacher_info.last_name,
            'in_session': lecture_info[0].in_session if lecture_info else False,
            'most_recent_lecture': lecture_info[0].id if lecture_info else None
        })

    return Response(ret_data)