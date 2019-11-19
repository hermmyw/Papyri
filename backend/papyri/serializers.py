from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserInfo, ProfilePic

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta():
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password':{'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

class ClassSerializer(serializers.Serializer):
    class_id = serializers.UUIDField()
    name = serializers.CharField(max_length=200)
    teacher_id = serializers.CharField(max_length=10)
    