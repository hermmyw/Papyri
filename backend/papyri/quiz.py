from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import QuizSerializer, QuestionSerializer
from .models import Quiz, QuizQuestion

class CreateQuizAPI(generics.CreateAPIView):
    """
    @api {post} /api/quiz/create/ Create quiz
    @apiGroup Quiz
    @apiName CreateQuizAPI

    @apiParam {String}  name        Quiz title.
    @apiParam {String}  question    Quiz question description.
    @apiParam {String}  class_id    Class id of the quiz.
    @apiParam {String}  answer_0    Description of first choice.
    @apiParam {String}  answer_1    Description of second choice.
    @apiParam {String}  answer_2    Description of third choice.
    @apiParam {String}  answer_3    Description of fourth choice.
    @apiParam {Number}  correct_answer  Correct choice.
    """
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()


class ActivateQuizAPI(generics.RetrieveUpdateAPIView):
    """
    @api {put} /api/quiz/activate/<int:id>/ Activate/open quiz
    @apiGroup Quiz
    @apiName ActivateQuizAPI
    """
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = True
        instance.save()
        return Response(QuizSerializer(instance).data)

class ReleaseQuizAPI(generics.RetrieveUpdateAPIView):
    '''
    @api {put} /api/quiz/release/<int:id>/ Release/close quiz and generate result
    @apiGroup Quiz
    @apiName ReleaseQuizAPI
    '''
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
    """
    @api {get} /api/quiz/list/[unreleased,released,active]/<int:class_id> List unreleased/released/active quizzes for a class
    @apiGroup Quiz
    @apiName ListQuizAPI

    @apiSuccess {Object[]} quizzes  List of quizzes
    @apiSuccess {String}  quizzes.name        Quiz title.
    @apiSuccess {String}  quizzes.question    Quiz question description.
    @apiSuccess {String}  quizzes.class_id    Class id of the quiz.
    @apiSuccess {String}  quizzes.answer_0    Description of first choice.
    @apiSuccess {String}  quizzes.answer_1    Description of second choice.
    @apiSuccess {String}  quizzes.answer_2    Description of third choice.
    @apiSuccess {String}  quizzes.answer_3    Description of fourth choice.
    @apiSuccess {Number}  quizzes.correct_answer  Correct choice.
    @apiSuccess {String}  quizzes.time_created  Time of quiz creation.
    @apiSuccess {Boolean} quizzes.active      Flag of active quiz.
    @apiSuccess {Boolean} quizzes.released    Flag of released quiz.
    """
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
    """
    @api {delete} /api/quiz/destroy/<int:id>/ Destroy a quiz
    @apiGroup Quiz
    @apiName DestroyQuizAPI
    """
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    lookup_field = 'id'


class CreateAnswerAPI(generics.CreateAPIView):
    """
    @api {post} /api/answer/create/ Create an answer submission
    @apiGroup Quiz
    @apiName CreateAnswerAPI

    @apiParam {Number}  choice      Student's choice to question.
    @apiParam {String}  quiz_id     Reference to the quiz.
    @apiParam {String}  student     Reference to the student of submission.
    """
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()


class AnswerByQuizAPI(generics.ListAPIView):
    """
    @api {get} /api/answer/quiz/<quiz_id>/ List answer submissions for a quiz
    @apiGroup Quiz
    @apiName AnswerByQuizAPI

    @apiSuccess {Object[]} answers    List of student answer submissions.
    @apiSuccess {Number}  answers.choice      Student's choice to question.
    @apiSuccess {String}  answers.quiz_id     Reference to the quiz.
    @apiSuccess {String}  answers.student     Reference to the student of submission.
    """
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    lookup_field = 'quiz_id'

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        queryset = Answer.objects.filter(quiz_id=quiz_id)
        return queryset

class AnswerByStudentAPI(generics.ListAPIView):
    """
    @api {get} /api/answer/student/<int:student>/ List answer submissions of a student
    @apiGroup Quiz
    @apiName AnswerByStudentAPI

    @apiSuccess {Object[]} answers    List of student answer submissions.
    @apiSuccess {Number}  answers.choice      Student's choice to question.
    @apiSuccess {String}  answers.quiz_id     Reference to the quiz.
    @apiSuccess {String}  answers.student     Reference to the student of submission.
    """
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    lookup_field = 'student'

    def get_queryset(self):
        student = self.kwargs['student']
        queryset = Answer.objects.filter(student=student)
        return queryset


class RetrieveResultAPI(generics.RetrieveAPIView):
    """
    @api {get} /api/quiz/result/<int:quiz_id>/ Get the result for a quiz
    @apiGroup Quiz
    @apiName RetrieveResultAPI

    @apiSuccess {String}    quiz_id         Refernce to the quiz.
    @apiSuccess {Number}    correct_answer  Correct choice of the quiz.
    @apiSuccess {Number}    num_students    Number of student submissions.
    @apiSuccess {Number}    choice_0_percent    Percentage of students that choose first choice.
    @apiSuccess {Number}    choice_1_percent    Percentage of students that choose second choice.
    @apiSuccess {Number}    choice_2_percent    Percentage of students that choose third choice.
    @apiSuccess {Number}    choice_3_percent    Percentage of students that choose fourth choice.
    """
    serializer_class = ResultSerializer
    queryset = Result.objects.all()
    lookup_field = 'quiz_id'
