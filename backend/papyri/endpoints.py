from django.urls import path, include
from rest_framework import routers
from .account import RegistrationAPI, LoginAPI, UserAPI
from . import classes
from . import attendance

urlpatterns = [
    path('user/register/', RegistrationAPI.as_view()),
    path('user/login/', LoginAPI.as_view()),
    path('user/', UserAPI.as_view()),
    path('classes/', classes.class_list),
    path('classes/teacher/', classes.class_by_teacher),
    path('classes/student/', classes.add_student),
    path('classes/student/<int:student_id>', classes.get_classes_by_student),
    path('attendance/start/', attendance.start_lecture),
    path('attendance/stop/', attendance.end_lecture),
    path('attendance/attend/', attendance.attend),
    path('attendance/<int:class_id>', attendance.get_attendance),
] 