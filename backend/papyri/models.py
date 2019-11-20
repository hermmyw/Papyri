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
    pic1 = models.ImageField(upload_to='profile_pics')
    pic2 = models.ImageField(upload_to='profile_pics', blank=True)
    pic3 = models.ImageField(upload_to='profile_pics', blank=True)
    pic4 = models.ImageField(upload_to='profile_pics', blank=True)
    pic5 = models.ImageField(upload_to='profile_pics', blank=True)
    
    def __str__(self):
        return self.owner.owner.username


# class ClassInfo(models.Model):
#     name = models.CharField(max_length=200)
#     teacher_id = models.ForeignKey(UserInfo, on_delete=models.CASCADE)


# class UserClassRelationship(models.Model):
#     class_id = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE) 


# class Lecture(models.Model):
#     name = models.CharField(max_length=200)
#     slide_link = models.URLField()
#     class_id = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
#     date = models.DateField(auto_now_add=True)
#     in_session = models.BooleanField(default=False)


# class LectureAttendance(models.Model):
#     class_id = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
#     lecture_id = models.ForeignKey(Lecture, on_delete=models.CASCADE)
#     student_id = models.ForeignKey(User, on_delete=models.CASCADE)


# class Quiz(models.Model):
#     name = models.CharField(max_length=200)
#     description = models.CharField(max_length=2000)
#     time_created = models.DateTimeField(auto_now_add=True)
#     teacher_id = models.ForeignKey(UserInfo, on_delete=models.CASCADE)



# class QuizQuestion(models.Model):
#     quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
#     question_number = models.PositiveIntegerField()
#     question = models.CharField(max_length=200)
    
#     answer_0 = models.CharField(max_length=200)
#     answer_1 = models.CharField(max_length=200)
#     answer_2 = models.CharField(max_length=200)
#     answer_3 = models.CharField(max_length=200)

#     correct_answer = models.PositiveIntegerField(validators=[MaxValueValidator(3, message="Only accepts values from 0 to 3")])




