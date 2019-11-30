from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import QuizSerializer, AnswerSerializer
from .models import Quiz, Answer

class CreateQuizAPI(generics.CreateAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

class ActivateQuizAPI(generics.RetrieveUpdateAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = True
        instance.save()
        return Response(QuizSerializer(instance).data)

class ReleaseQuizAPI(generics.RetrieveUpdateAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.released = True
        instance.save()
        return Response(QuizSerializer(instance).data)

class ListQuizAPI(generics.ListAPIView):
    serializer_class = QuizSerializer
    lookup_field = 'class_id'
    state = ''

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.state = kwargs['state']

    def get_queryset(self):
        class_id = self.kwargs['class_id']
        queryset = Quiz.objects.filter(class_id=class_id)
        if self.state == 'unreleased':
            queryset = queryset.filter(released=False)
        elif self.state == 'released':
            queryset = queryset.filter(released=True)
        elif self.state == 'active':
            queryset = queryset.filter(active=True)
        return queryset

class DestroyQuizAPI(generics.DestroyAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    lookup_field = 'id'

class CreateAnswerAPI(generics.CreateAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()

class AnswerByQuizAPI(generics.ListAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    lookup_field = 'quiz_id'

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        queryset = Answer.objects.filter(quiz_id=quiz_id)
        return queryset

class AnswerByStudentAPI(generics.ListAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    lookup_field = 'student'

    def get_queryset(self):
        student = self.kwargs['student']
        queryset = Answer.objects.filter(student=student)
        return queryset