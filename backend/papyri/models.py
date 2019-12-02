import uuid
from django.db import models
from django.core.validators import RegexValidator, MaxValueValidator
from django.contrib.auth.models import User

# Create your models here.

class UserInfo(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    uid = models.CharField(validators=[RegexValidator(r'^[0-9]{9}')], max_length=10, blank=True)
    
    is_student = models.BooleanField(default=True)

    def __str__(self):
        return self.owner.username

class ProfilePic(models.Model):
    owner = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='profile_pic')
    pic1 = models.ImageField(upload_to='profile_pics', blank=True)
    pic2 = models.ImageField(upload_to='profile_pics', blank=True)
    pic3 = models.ImageField(upload_to='profile_pics', blank=True)
    pic4 = models.ImageField(upload_to='profile_pics', blank=True)
    pic5 = models.ImageField(upload_to='profile_pics', blank=True)
    
    def __str__(self):
        return self.owner.owner.username


class ClassInfo(models.Model):
    name = models.CharField(max_length=200)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    term = models.CharField(max_length=200)
    year = models.CharField(max_length=10)
    registration_code = models.CharField(max_length=5)

    def __str__(self):
        return self.name


class StudentClassRelationship(models.Model):
    c = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE) 


class Lecture(models.Model):
    name = models.CharField(max_length=200)
    slide_link = models.URLField()
    c = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    in_session = models.BooleanField(default=True)
    latitude = models.CharField(max_length=200)
    longitude = models.CharField(max_length=200)


class LectureAttendance(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)


class Quiz(models.Model):
    name = models.CharField(max_length=200)
    question = models.CharField(max_length=2000)
    time_created = models.DateTimeField(auto_now_add=True)
    class_id = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    active = models.BooleanField(default=False)
    released = models.BooleanField(default=False)

    answer_0 = models.CharField(max_length=200)
    answer_1 = models.CharField(max_length=200)
    answer_2 = models.CharField(max_length=200)
    answer_3 = models.CharField(max_length=200)

    correct_answer = models.PositiveIntegerField(validators=[MaxValueValidator(3, message="Only accepts values from 0 to 3")])
    def __str__(self):
        return self.name

class Answer(models.Model):
    quiz_id = models.ForeignKey(Quiz, related_name="quiz", on_delete=models.CASCADE)
    student = models.ForeignKey(User, related_name="student", on_delete=models.CASCADE)
    choice = models.PositiveIntegerField(validators=[MaxValueValidator(3, message="Only 0 to 3")])

    def __str__(self):
        return str(self.quiz_id) + ": " + str(self.student)

class Result(models.Model):
    quiz_id = models.OneToOneField(Quiz, on_delete=models.CASCADE)

    correct_answer = models.PositiveIntegerField(validators=[MaxValueValidator(3, message="Only accepts values from 0 to 3")])
    num_students = models.PositiveIntegerField()

    choice_0_percent = models.FloatField()
    choice_1_percent = models.FloatField()
    choice_2_percent = models.FloatField()
    choice_3_percent = models.FloatField()

    def __str__(self):
        return str(self.quiz_id) + " Result"