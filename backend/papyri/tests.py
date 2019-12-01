from django.test import TestCase
import json

from django.contrib.auth.models import User
from .models import ClassInfo, UserInfo, Lecture, LectureAttendance
from rest_framework.test import APITestCase, force_authenticate
from django.utils.crypto import get_random_string

import requests


class ClassTestCase(APITestCase):
    def setUp(self):
        self.teacher =  User.objects.create(username="teacher_test",
                                                password="12345",
                                                email="teacher_test@gmail.com")
        self.teacher_info = UserInfo.objects.create(owner=self.teacher,
                                                    uid="123456789",
                                                    is_student=False)
        
        self.student = User.objects.create(username="student_test",
                                            password="12345",
                                            email="student_test@gmail.com")
        self.student_info = UserInfo.objects.create(owner=self.student,
                                                    uid="204748664",
                                                    is_student=True)
        
        code = get_random_string(length=5).upper()
        while ClassInfo.objects.filter(registration_code=code).exists():
            code = get_random_string(length=5).upper()

        self.class_info = ClassInfo.objects.create(name="Test Class",
                                teacher_id=self.teacher.id,
                                term="Fall",
                                year="2019",
                                registration_code=code)

    def test_class_list_get(self):
        print("\n\nTesting GET /api/classes/...")
        response = self.client.get("/api/classes/", format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(len(response.data[0]), 6)
        print("..OK")

    def test_class_list_post(self):
        print("\n\nTesting POST /api/classes/...")
        data = {
            "name": "Test Class 2",
            "teacher_id": self.teacher.id,
            "term": "Winter",
            "year": "2020"
        }

        data_bad_id = {
            "name": "Test Class 2",
            "teacher_id": 999,
            "term": "Winter",
            "year": "2020"
        }

        data_missing_field = {
            "name": "Test Class 2",
            "teacher_id": 999,
            "term": "Winter",
        }

        response = self.client.post("/api/classes/", data=data_bad_id, format='json')
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/api/classes/", data=data_missing_field, format='json')
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/api/classes/", data=data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(ClassInfo.objects.all()), 2)

        print("..OK\n")

    
    def test_add_student(self):
        bad_code = {
            'code': 'a13fs',
            'student_id': self.student.id
        }

        bad_id = {
            'code': self.class_info.registration_code,
            'student_id': 900
        }

        bad_both = {
            'code': 'a13fs',
            'student_id': 900
        }

        good_data = {
            'code': self.class_info.registration_code,
            'student_id': self.student.id
        }

        print("\n\nTesting bad registration code /api/classes/student/enroll/... ")
        response = self.client.post("/api/classes/student/enroll/", data=bad_code, format='json')
        self.assertEqual(response.status_code, 400)
        print("..OK")

        print("Testing bad student_id /api/classes/student/enroll/... ")
        response = self.client.post("/api/classes/student/enroll/", data=bad_id, format='json')
        self.assertEqual(response.status_code, 400)
        print("..OK")

        print("Testing bad student_id and registration code /api/classes/student/enroll/... ")
        response = self.client.post("/api/classes/student/enroll/", data=bad_both, format='json')
        self.assertEqual(response.status_code, 400)
        print("..OK")

        print("Testing good input /api/classes/student/enroll/... ")
        response = self.client.post("/api/classes/student/enroll/", data=good_data, format='json')
        self.assertEqual(response.status_code, 201)
        print("..OK")

        print("Testing duplicate /api/classes/student/enroll/... ")
        response = self.client.post("/api/classes/student/enroll/", data=good_data, format='json')
        self.assertEqual(response.status_code, 400)
        print("..OK")

    def test_class_by_teacher(self):
        print("\n\nTesting /api/classes/teacher/:teacher_id")
        response = self.client.get("/api/classes/teacher/999", format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

        teacher_url = "/api/classes/teacher/" + str(self.teacher.id)
        response = self.client.get(teacher_url, format='json')
        data = response.data[0]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(data['id'], self.class_info.id)
        self.assertEqual(data['name'], "Test Class")
        self.assertEqual(data['term'], "Fall")
        self.assertEqual(data['year'], "2019",
        self.assertEqual(data['registration_code'], self.class_info.registration_code))
        print("..OK\n")

    def test_class_by_student(self):
        print("\n\nTesting /api/classes/student/:student_id...")
        data = {
            'code': self.class_info.registration_code,
            'student_id': self.student.id
        }

        # add student to class
        response = self.client.post("/api/classes/student/enroll/", data=data, format='json')
        self.assertEqual(response.status_code, 201)

        # test non existent student result should be an empty array
        response = self.client.get("/api/classes/student/999", format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
        
        student_url = "/api/classes/student/" + str(self.student.id)
        response = self.client.get(student_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(len(response.data[0]), 8)
        print("..OK\n")


class AttendanceTestCase(APITestCase):
    def setUp(self):
        self.teacher =  User.objects.create(username="teacher_test",
                                                password="12345",
                                                email="teacher_test@gmail.com")
        self.teacher_info = UserInfo.objects.create(owner=self.teacher,
                                                    uid="123456789",
                                                    is_student=False)
        
        self.student = User.objects.create(username="student_test",
                                            password="12345",
                                            email="student_test@gmail.com")
        self.student_info = UserInfo.objects.create(owner=self.student,
                                                    uid="204748664",
                                                    is_student=True)
        
        code = get_random_string(length=5).upper()
        while ClassInfo.objects.filter(registration_code=code).exists():
            code = get_random_string(length=5).upper()

        self.class_info = ClassInfo.objects.create(name="Test Class",
                                teacher_id=self.teacher.id,
                                term="Fall",
                                year="2019",
                                registration_code=code)

    def test_start_lecture(self):
        print("\n\nTesting api/attendance/start/...")
        data = {
            "c_id": self.class_info.id
        }

        data_bad_id = {
            "c_id": 999
        }

        # test non existent class_id
        response = self.client.post("/api/attendance/start/", data=data_bad_id, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(Lecture.objects.all()), 0)

        response = self.client.post("/api/attendance/start/", data=data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Lecture.objects.all()), 1)
        lecture_id = response.data['id']
        self.assertEqual(Lecture.objects.get(id=lecture_id).in_session, True)
        
        # test to make sure you cannot start a lecture in session
        response = self.client.post("/api/attendance/start/", data=data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(Lecture.objects.all()), 1)

        print("..OK\n")

    def test_end_lecture(self):
        print("\n\nTesting api/attendance/stop/...")
        data = {
            "c_id": self.class_info.id
        }

        response = self.client.post("/api/attendance/start/", data=data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Lecture.objects.all()), 1)
        lecture_id = response.data['id']

        response = self.client.post("/api/attendance/stop/", data={'id': 999}, format="json")
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/api/attendance/stop/", data={'id': lecture_id}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Lecture.objects.get(id=lecture_id).in_session, False)

        print("..OK\n")

    def test_attend(self):
        print("\n\nTesting /api/attendance/attend/...")
        lecture = Lecture.objects.create(c_id=self.class_info.id, in_session=True)

        data = {
            "lecture_id": lecture.id,
            "student_id": self.student_info.id
        }

        data_bad_lecture = {
            "lecture_id": 999,
            "student_id": self.student_info.id
        }

        data_bad_student = {
            "lecture_id": lecture.id,
            "student_id": 999
        }

        response = self.client.post("/api/attendance/attend/", data_bad_lecture, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(LectureAttendance.objects.all()), 0)

        response = self.client.post("/api/attendance/attend/", data_bad_student, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(LectureAttendance.objects.all()), 0)

        response = self.client.post("/api/attendance/attend/", data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(LectureAttendance.objects.all()), 1)

        print("..OK\n")

    def test_get_attendance(self):
        print("\n\nTesting /api/attendance/:class_id...")
        lecture = Lecture.objects.create(c_id=self.class_info.id, in_session=False)

        url = "/api/attendance/" + str(self.class_info.id)
        bad_url = "/api/attendance/999"

        response = self.client.get(bad_url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['lecture_id'], lecture.id)

        print("..OK\n")

    def test_get_student_attendance(self):
        print("\n\nTesting /api/attendance/:class_id/:student_id...")
        lecture = Lecture.objects.create(c_id=self.class_info.id, in_session=False)
        lecture_attendance = LectureAttendance.objects.create(lecture_id=lecture.id, student_id=self.student_info.id)

        url = "/api/attendance/" + str(self.class_info.id) + "/" + str(self.student_info.id)
        bad_class_url = "/api/attendance/999" + "/" + str(self.student_info.id)
        bad_student_url = "/api/attendance/" + str(self.class_info.id) + "/999"

        print("Testing bad class_id")
        response = self.client.get(bad_class_url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['days_attended']), 0)
        self.assertEqual(len(response.data['days_absent']), 0)

        print("Testing bad student_id")
        response = self.client.get(bad_student_url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['days_attended']), 0)
        self.assertEqual(len(response.data['days_absent']), 0)

        print("Testing good input")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['days_attended']), 1)
        self.assertEqual(len(response.data['days_absent']), 0)

        print("..OK\n")
