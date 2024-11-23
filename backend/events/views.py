from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from .serializers import EventSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated] 

class EventListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

