from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

# Create your models here.

class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    uid = models.CharField(validators=[RegexValidator(r'^[0-9]{9}')], 
        primary_key=True, max_length=10)

    is_student = models.BooleanField(default=True)

    def __str__(self):
        return self.uid


class ProfilePic(models.Model):
    owner = models.ForeignKey(UserInfo, on_delete=models.CASCADE, 
        related_name='profile_pic')
    pic1 = models.ImageField(upload_to='profile_pics')
    pic2 = models.ImageField(upload_to='profile_pics', blank=True)
    pic3 = models.ImageField(upload_to='profile_pics', blank=True)
    pic4 = models.ImageField(upload_to='profile_pics', blank=True)
    pic5 = models.ImageField(upload_to='profile_pics', blank=True)