from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClassInfo, StudentClassRelationship
from .serializers import ClassSerializer, StudentClassSerializer
from django.core import serializers

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
        print(request.data)
        serializer = ClassSerializer(data=request.data)
        if serializer.is_valid():
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

    serializer = StudentClassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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

    data = serializers.serialize('json', classes, fields=('name', 'class_id', 'student_id'))
    ret_data = []
    for c in classes:
        ret_data.append({
            'id': c.id,
            'name': c.name,
            'teacher_id': c.teacher.id,
            'teacher_name': c.teacher.owner.first_name + " " + c.teacher.owner.last_name
        })
        
    return Response(ret_data)
    