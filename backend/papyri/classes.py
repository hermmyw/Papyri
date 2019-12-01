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
    @api {get} /classes/ List All Classes
    @apiName GetClasses
    @apiGroup Classes
    @apiDescription List all classes in the database regardless of term, year, or instructor

    @apiSuccess {Object[]} classes List of Classes
    @apiSuccess {String} classes.id Class ID
    @apiSuccess {String} classes.name Name of the class (e.g. CS130)
    @apiSuccess {String} classes.teacher_id User ID of instructor
    @apiSuccess {String} classes.term School term of the class (e.g. Fall)
    @apiSuccess {String} classes.year School year of the class
    @apiSuccess {String} classes.registration_code 5 character random alphanumeric string that can be used to enroll in course
    """

    """
    @api {post} /classes/ Create a Class
    @apiName CreateClass
    @apiGroup Classes
    @apiDescription Create a class taught by a teacher. Registration code is provided to give to students
    
    @apiParam {String} name Name of the class (e.g. CS130)
    @apiParam {String} teacher_id User ID of the course instructor
    @apiParam {String} term School term of the class (e.g. Fall)
    @apiParam {String} year School year of the class

    @apiParamExample {String} {json} Request Example: 
        {
            "name": "CS130",
            "teacher_id": 1,
            "term": "Fall",
            "year": "2019",
        }

    @apiSuccess {String} id Class ID
    @apiSuccess {String} name Name of the class (e.g. CS130)
    @apiSuccess {String} teacher_id User ID of instructor
    @apiSuccess {String} term School term of the class (e.g. Fall)
    @apiSuccess {String} year School year of the class
    @apiSuccess {String} registration_code 5 character random alphanumeric string that can be used to enroll in course
    """

    if request.method == "GET":
        classes = ClassInfo.objects.all()
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        teacher_id = request.data.get("teacher_id")
        serializer = ClassSerializer(data=request.data)
        
        try:
            user_info = UserInfo.objects.filter(is_student=False).get(owner_id=teacher_id)
        except UserInfo.DoesNotExist:
            return Response({"error": "That teacher does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid() and user_info:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def class_by_teacher(request, teacher_id):
    """
    @api {get} /classes/teacher/:teacher_id Get Classes by Teacher
    @apiName GetTeacherClasses
    @apiGroup Classes
    @apiDescription Get classes taught by a teacher. Returns in same format as /classes/

    @apiSuccess {Object[]} classes
    @apiSuccess {String} classes.id Class ID
    @apiSuccess {String} classes.name Name of the class (e.g. CS130)
    @apiSuccess {String} classes.teacher_id User ID of instructor
    @apiSuccess {String} classes.term School term of the class (e.g. Fall)
    @apiSuccess {String} classes.year School year of the class
    @apiSuccess {String} classes.registration_code 5 character random alphanumeric string that can be used to enroll in course
    """

    try:
        classes = ClassInfo.objects.filter(teacher_id=teacher_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_student(request):
    """
    @api {post} /classes/student/enroll Enroll
    @apiName AddStudent
    @apiGroup Classes
    @apiDescription Enroll a student in a class

    @apiParam {String} code Registration code of class
    @apiParam {String} student_id User ID of the student being enrolled

    @apiSuccess {String} id Database entry ID for the relationship between this student and class
    @apiSuccess {String} c_id Class ID of class student enrolled in
    @apiSuccess {String} student_id User ID of student who enrolled
    @apiSuccess {String} class_name Name of the class student enrolled in
    """

    reg_code = request.data.get('code')
    try:
        class_object = ClassInfo.objects.get(registration_code=reg_code)
    except ClassInfo.DoesNotExist:
        return Response({"error": "Class with that registration code does not exist"}, status=status.HTTP_400_BAD_REQUEST)
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
    @api {get} /classes/student/:student_id Get Classes by Student
    @apiName GetStudentClasses
    @apiGroup Classes
    @apiDescription Get classes student is enrolled in

    @apiSuccess {Object[]} classes
    @apiSuccess {String} classes.id Class ID
    @apiSuccess {String} classes.name Name of the class (e.g. CS130)
    @apiSuccess {String} classes.teacher_id User ID of instructor
    @apiSuccess {String} classes.term School term of the class (e.g. Fall)
    @apiSuccess {String} classes.year School year of the class
    @apiSuccess {String} classes.registration_code 5 character random alphanumeric string that can be used to enroll in course
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
            'term': c.term,
            'year': c.year,
            'in_session': lecture_info[0].in_session if lecture_info else False,
            'most_recent_lecture': lecture_info[0].id if lecture_info else None
        })

    return Response(ret_data)