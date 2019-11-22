from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from knox.models import AuthToken

from .serializers import (CreateUserSerializer, UserSerializer, 
                            UserInfoSerializer, LoginUserSerializer, 
                            ProfilePicSerializer)

from .models import UserInfo, ProfilePic


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class UserAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user_info = UserInfo.objects.get(owner=self.request.user)
        profile_pic = ProfilePic.objects.get(owner=user_info)
        return Response({
            "user": UserSerializer(self.request.user).data,
            "user_info": UserInfoSerializer(user_info).data,
            "profile_pic": ProfilePicSerializer(profile_pic).data
        })