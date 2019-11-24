from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserInfo, ProfilePic, ClassInfo, StudentClassRelationship
from .models import Lecture, LectureAttendance
from .models import Quiz, QuizQuestion


class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=50, write_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    # create userinfo in background
    uid = serializers.CharField(max_length=50, allow_blank=True)
    is_student = serializers.BooleanField(default=False)
    # create profile_pic
    pic1 = serializers.ImageField(allow_null=True)
    pic2 = serializers.ImageField(allow_null=True)
    pic3 = serializers.ImageField(allow_null=True)
    pic4 = serializers.ImageField(allow_null=True)
    pic5 = serializers.ImageField(allow_null=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()
        # create userinfo
        userinfo = UserInfo(owner=user, 
                            uid=validated_data['uid'], 
                            is_student=validated_data['is_student'])
        userinfo.save()
        # create profile_pic
        profile_pic = ProfilePic(owner=userinfo,
                                    pic1=validated_data['pic1'],
                                    pic2=validated_data['pic2'],
                                    pic3=validated_data['pic3'],
                                    pic4=validated_data['pic4'],
                                    pic5=validated_data['pic5'])
        profile_pic.save()
        return userinfo


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('__all__')


class ProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePic
        fields = ('__all__')


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class ClassSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200)
    teacher_id = serializers.PrimaryKeyRelatedField(queryset=UserInfo.objects.filter(is_student=False))

    class Meta:
        model = ClassInfo
        fields = ('__all__')

    def create(self, validated_data):
        return ClassInfo.objects.create(name=validated_data['name'],
                                        teacher_id=validated_data['teacher_id'].id)


class StudentClassSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    class_id = serializers.PrimaryKeyRelatedField(queryset=ClassInfo.objects.all())
    student_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    in_session = serializers.BooleanField()

    class Meta:
        model = StudentClassRelationship
        fields = ('__all__')

    def create(self, validated_data):
        return StudentClassRelationship.objects.create(class_id=validated_data['class_id'],
                                                        student_id=validated_data['student_id'])


class LectureSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    c_id = serializers.PrimaryKeyRelatedField(queryset=ClassInfo.objects.all())
    date = serializers.DateTimeField(read_only=True, format='iso-8601')
    in_session = serializers.BooleanField(required=False)

    class Meta:
        model = Lecture
        fields = ['id', 'c_id', 'date', 'in_session']

    def create(self, validated_data):
        return Lecture.objects.create(c=validated_data['c_id'],
                                        in_session=True)


class LectureAttendanceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    lecture_id = serializers.PrimaryKeyRelatedField(queryset=Lecture.objects.all())
    student_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = LectureAttendance
        fields = ('__all__')
    
    def create(self, validated_data):
        return LectureAttendance.objects.create(lecture=validated_data['lecture_id'],
                                                student=validated_data['student_id'])


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = '__all__'


