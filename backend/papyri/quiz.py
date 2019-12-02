from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import QuizSerializer, AnswerSerializer, ResultSerializer
from .models import Quiz, Answer, Result

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

        # generate quiz result
        quiz_id = self.kwargs['id']
        answers = Answer.objects.filter(quiz_id=quiz_id)
        num_students = len(answers)

        # calculate percentage
        num_0 = 0
        num_1 = 0
        num_2 = 0
        num_3 = 0
        for a in answers:
            if a.choice == 0:
                num_0 += 1
            elif a.choice == 1:
                num_1 += 1
            elif a.choice == 2:
                num_2 += 1
            elif a.choice == 3:
                num_3 += 1

        result = Result.objects.create(quiz_id=instance, 
                        correct_answer=instance.correct_answer,
                        num_students=num_students,
                        choice_0_percent=round(num_0/num_students,2),
                        choice_1_percent=round(num_1/num_students,2),
                        choice_2_percent=round(num_2/num_students,2),
                        choice_3_percent=round(num_3/num_students,2))

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

class RetrieveResultAPI(generics.RetrieveAPIView):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()
    lookup_field = 'quiz_id'