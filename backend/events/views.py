from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated] 

