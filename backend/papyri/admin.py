from django.contrib import admin
from .models import UserInfo, ProfilePic, Quiz, QuizQuestion, ClassInfo
# Register your models here.
admin.site.register(UserInfo)
admin.site.register(ProfilePic)
admin.site.register(ClassInfo)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)