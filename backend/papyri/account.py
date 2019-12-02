from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from knox.models import AuthToken

from .serializers import (CreateUserSerializer, UserSerializer, 
                            UserInfoSerializer, LoginUserSerializer, 
                            ProfilePicSerializer)

from .models import UserInfo, ProfilePic

'''
@api {post} /api/user/register/ User registration
@apiName RegistrationAPI

@apiParam {String} 	username 		Username.
@apiParam {String} 	email			User email.
@apiParam {String}	password		User password.
@apiParam {String}  first_name      User first name.
@apiParam {String}  last_name       User last name.
@apiParam {Number}  uid             User student id (blank for instructor).
@apiParam {Boolean} is_student      User student flag.
@apiParam {String}  pic1            Profile pic 1 (blank for instructor).
@apiParam {String}  pic2            Profile pic 2 (blank for instructor).
@apiParam {String}  pic3            Profile pic 3 (blank for instructor).
@apiParam {String}  pic4            Profile pic 4 (blank for instructor).
@apiParam {String}  pic5            Profile pic 5 (blank for instructor).

@apiSuccess {Object} user               Registered User object.
@apiSuccess {Number} user.id 		    Users unique ID.
@apiSuccess {String} user.username 	    Username.
@apiSuccess {String} user.email  	    User email.
@apiSuccess {String} user.first_name  	User first name.
@apiSuccess {String} user.last_name  	User last name.
@apiSuccess {String} token 			    User auth token from registration.
'''
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

'''
@api {post} /api/user/login/ User login
@apiName LoginAPI

@apiParam {String} 	username 		Username.
@apiParam {String}	password		User password.

@apiSuccess {Object} user               Login User object.
@apiSuccess {Number} user.id 		    Users unique ID.
@apiSuccess {String} user.username 	    Username.
@apiSuccess {String} user.email  	    User email.
@apiSuccess {String} user.first_name  	User first name.
@apiSuccess {String} user.last_name  	User last name.
@apiSuccess {String} token 			    User auth token from login.
'''
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


"""
@api {get} /api/user/ User authentication
@apiName UserAPI

@apiParam {String} 	token 			User auth token from login.

@apiSuccess {Object} user               User object linked to provided token.
@apiSuccess {Number} user.id 		    Users unique ID.
@apiSuccess {String} user.username 	    Username.
@apiSuccess {String} user.email  	    User email.
@apiSuccess {String} user.first_name  	User first name.
@apiSuccess {String} user.last_name  	User last name.
@apiSuccess {Object} userinfo           user information object
@apiSuccess {Number} userinfo.uid                User student id (blank for instructor).
@apiSuccess {Boolean} userinfo.is_student        User student flag.
@apiSuccess {Object} profile_pic        User profile pics object.
@apiSuccess {String} profile_pic.pic1   User profile pic 1.
@apiSuccess {String} profile_pic.pic2   User profile pic 2.
@apiSuccess {String} profile_pic.pic3   User profile pic 3.
@apiSuccess {String} profile_pic.pic4   User profile pic 4.
@apiSuccess {String} profile_pic.pic5   User profile pic 5.
"""
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