from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lecture, LectureAttendance
from django.contrib.auth.models import User
from .serializers import LectureSerializer, LectureAttendanceSerializer

import datetime


@api_view(['POST'])
def start_lecture(request):
    """
    @api {post} /attendance/start/ Take Attendance
    @apiName StartLecture
    @apiGroup Attendance
    @apiDescription Creates a new Lecture entry into the database for the class ID provided.
        You cannot take attendance if there is currently active Lecture (from calling StartLecture before)
        You can make a Lecture inactive by called StopLecture
    
    @apiParam {String} c_id Class ID of the class you are taking attendance for

    @apiSuccess {String} id Lecture ID (used for students trying to attend lectures)
    @apiSuccess {String} c_id Class ID of the parent of the Lecture
    @apiSuccess {String} date Date the lecture started in ISO format
    @apiSuccess {Boolean} in_session Whether the lecture is active or not (defaults to False)
    """

    try:
        last_lecture = Lecture.objects.filter(c_id=request.data.get('c_id')).latest(field_name='date')
        if (last_lecture.in_session):
            return Response({'error': 'Lecture already in session. End current lecture before starting a new one'}, 
                            status=status.HTTP_400_BAD_REQUEST)
    except Lecture.DoesNotExist:
        serializer = LectureSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer = LectureSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def end_lecture(request):
    """
    @api {post} /attendance/stop Close Attendance Taking
    @apiName StopLecture
    @apiGroup Attendance
    @apiDescription Sets the lecture specified by 'id' to false.
        This makes the lecture inactive

    @apiParam {String} id Lecture ID to stop attendance for

    @apiSuccess {String} id Lecture ID (used for students trying to attend lectures)
    @apiSuccess {String} c_id Class ID of the parent of the Lecture
    @apiSuccess {String} date Date the lecture started in ISO format
    @apiSuccess {Boolean} in_session Whether the lecture is active or not (Should be false now)
    """

    try: 
        lecture = Lecture.objects.get(id=request.data.get('id'))
    except:
        return Response({"error": "Lecture ID not found."}, status=status.HTTP_400_BAD_REQUEST)

    lecture.in_session = False
    lecture.save()

    return Response({
        'id': lecture.id,
        'c_id': lecture.c_id,
        'date': lecture.date,
        'in_session': lecture.in_session
    })


@api_view(['POST'])
def attend(request):
    """
    @api {post} /attendance/attend Attend lecture
    @apiName Attend
    @apiGroup Attendance
    @apiDescription Allows student to attend a lecture

    @apiParam {String} lecture_id Lecture ID of lecture to attend
    @apiParam {String} student_id Student ID who is attending the lecture
    @apiParam {String} photo_string base64 encoding of photo

    @apiSuccess {String} id LectureStudent ID represents that a student attended the lecture
    @apiSuccess {String} lecture_id Lecture ID of the lecture attended
    @apiSuccess {String} student_id User ID of the student who attended the lecture
    """
    serializer = LectureAttendanceSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_attendance(request, class_id):
    """
    @api {get} /attendance/:class_id Get Class Attendance
    @apiName GetAttendance
    @apiGroup Attendance
    @apiDescription Get attendance of all lectures in a class

    @apiSuccess {Object[]} lectures List of lectures
    @apiSuccess {String} lectures.lecture_id Lecture ID
    @apiSuccess {String} lectures.date Date lecture was started
    @apiSuccess {Number} lectures.attendance Number representing number of students who attended lecture
    """

    try:
        attendance = Lecture.objects.raw("""
            SELECT l.id, l.date, COUNT(a.id) AS attendance
            FROM papyri_lecture AS l
            LEFT JOIN papyri_lectureattendance a
            ON l.id = a.lecture_id
            WHERE l.c_id = %s
            GROUP BY l.id
            ORDER BY l.date DESC
        """, [class_id])
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = []
    for lecture in attendance:
        data.append({
            'lecture_id': lecture.id,
            'date': lecture.date,
            'attendance': lecture.attendance
        })

    return Response(data)

@api_view(['GET'])
def get_student_attendance(request, class_id, student_id):
    """
    @api {get} /attendance/:class_id/:student_id Get Student Attendance
    @apiName GetStudentAttendance
    @apiGroup Attendance
    @apiDescription Get student's attendance for a particular class

    @apiSuccess {Object[]} days_attended List of lectures student attended
    @apiSuccess {String} days_attended.lecture_id Lecture ID
    @apiSuccess {String} days_attended.date Date lecture occurred
    @apiSuccess {Object[]} days_absent List of lectures student did not attend
    @apiSuccess {String} days_absent.lecture_id Lecture ID
    @apiSuccess {String} days_absent.date Date lecture occurred
    """

    try:
        days_attended = Lecture.objects.raw("""
            SELECT l.id, l.date
            FROM papyri_lecture l
            LEFT join papyri_lectureattendance a
            ON l.id = a.lecture_id
            WHERE l.c_id = %s AND a.student_id = %s
            ORDER BY l.date
            """, [class_id, student_id])
    except:
        return Response({"error": "Error fetching Lectures"}, status.HTTP_400_BAD_REQUEST)
    
    try: 
        all_lectures = Lecture.objects.filter(c_id=class_id)
    except:
        return Response({"error": "Error fetching Lectures by class_id"}, status.HTTP_400_BAD_REQUEST)

    data = {
        'days_attended': [],
        'days_absent': [],
    }

    try:
        User.objects.get(id=student_id)
    except User.DoesNotExist:
        return Response(data, status.HTTP_200_OK)

    for lecture in days_attended:
        data['days_attended'].append({
            "lecture_id": lecture.id,
            'date': lecture.date
        })

    for lecture in all_lectures:
        entry = {
            "lecture_id": lecture.id, 
            "date": lecture.date
        }
        if entry not in data['days_attended']:
            data['days_absent'].append(entry)
            
    return Response(data)    
        
    
