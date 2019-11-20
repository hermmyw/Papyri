from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClassInfo
from .serializers import ClassSerializer

@api_view(['GET', 'POST'])
def class_list(request):
    """
    List all classes or create a new class
    """

    if request.method == "GET":
        classes = ClassInfo.objects.all()
        serializer = ClassSerializer(classes, many=True)

        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ClassSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def class_by_teacher(request, id):
    """
    Get classes that a teacher teaches
    """

    try:
        classes = ClassInfo.filter(teacher_id=id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)
