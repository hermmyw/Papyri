from django.urls import path, include
from rest_framework import routers
from .account import RegistrationAPI, LoginAPI, UserAPI
from .quiz import (CreateQuizAPI, ActivateQuizAPI, ReleaseQuizAPI, ListQuizAPI, DestroyQuizAPI, 
                    CreateAnswerAPI, AnswerByQuizAPI, AnswerByStudentAPI, RetrieveResultAPI)
from . import classes
from . import attendance

urlpatterns = [
    path('user/register/', RegistrationAPI.as_view()),
    path('user/login/', LoginAPI.as_view()),
    path('user/', UserAPI.as_view()),
    path('classes/', classes.class_list),
    path('classes/teacher/<int:teacher_id>', classes.class_by_teacher),
    path('classes/student/enroll/', classes.add_student),
    path('classes/student/<int:student_id>', classes.get_classes_by_student),
    path('attendance/start/', attendance.start_lecture),
    path('attendance/stop/', attendance.end_lecture),
    path('attendance/attend/', attendance.attend),
    path('attendance/<int:class_id>', attendance.get_attendance),
    path('attendance/<int:class_id>/<int:student_id>', attendance.get_student_attendance),
    path('quiz/create/', CreateQuizAPI.as_view()),
    path('quiz/activate/<int:id>/', ActivateQuizAPI.as_view()),
    path('quiz/release/<int:id>/', ReleaseQuizAPI.as_view()),
    path('quiz/list/unreleased/<int:class_id>/', ListQuizAPI.as_view(state='unreleased')),
    path('quiz/list/released/<int:class_id>/', ListQuizAPI.as_view(state='released')),
    path('quiz/list/active/<int:class_id>/', ListQuizAPI.as_view(state='active')),
    path('quiz/destroy/<int:id>', DestroyQuizAPI.as_view()),
    path('answer/create', CreateAnswerAPI.as_view()),
    path('answer/quiz/<int:quiz_id>', AnswerByQuizAPI.as_view()),
    path('answer/student/<int:student>', AnswerByStudentAPI.as_view()),
    path('quiz/result/<int:quiz_id>', RetrieveResultAPI.as_view()),
] 