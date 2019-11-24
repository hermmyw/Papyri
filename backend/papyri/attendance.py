from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lecture, LectureAttendance
from .serializers import LectureSerializer, LectureAttendanceSerializer

import datetime


@api_view(['POST'])
def start_lecture(request):
    last_lecture = Lecture.objects.filter(c_id=request.data.get('c_id')).latest(field_name='date')
    if (last_lecture.in_session):
        return Response({'error': 'Lecture already in session. End current lecture before starting a new one'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = LectureSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def end_lecture(request):
    try: 
        lecture = Lecture.objects.get(id=request.data.get('id'))
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
    serializer = LectureAttendanceSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_attendance(request, class_id):
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

    
