from django.test import TestCase
from . import RegistrationAPI, LoginAPI, UserAPI

import requests

# Create your tests here.

class LoginTestCase(TestCase):
    def test_login_and_registration(self):
        user_info = {
            'id': '204748664',
            'username': 'test',
            'password': 'test',
            'email': 'test@test.com'
        }

        # Test registration
        r = requests.post('http://localhost:8080/api/register', data=user_info)
        if r.status_code != 200:
            return False

        r_json = r.json()
        token = r_json["token"]

        # Test authentication
        r2 = requests.get('http://localhost:8080/api/user', params={'token': token})
        if r2.status_code != 200:
            return False
        r2_json = r2.json()
        if r2_json['id'] != user_info['id'] or \
            r2_json['username'] != user_info['username'] or \
            r2_json['password'] !=  user_info['password'] or \
            r2_json['email'] != user_info['email']:
            return False
        
        # Test login
        r3 = requests.post('http://localhost:8080/api/register', data={'username': 'test', 'password': 'test'})
        if r3.status_code != 200:
            return False
        
        if r2_json['id'] != user_info['id'] or \
            r2_json['username'] != user_info['username'] or \
            r2_json['password'] !=  user_info['password'] or \
            r2_json['email'] != user_info['email']:
            return False



