from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import QuizSerializer, QuestionSerializer
from .models import Quiz, QuizQuestion

class CreateQuizAPI(generics.CreateAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

class CreateQuestionAPI(generics.CreateAPIView):
    serializer_class = QuestionSerializer
    queryset = QuizQuestion.objects.all()

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

class ListQuestionAPI(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        queryset = QuizQuestion.objects.filter(quiz_id=quiz_id)
        return queryset