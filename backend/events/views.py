from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, Categories, EventRegistration
from .serializers import EventSerializer, CategoriesSerializer, EventRegistrationSerializer
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
        return Response(serializer.data)

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    

class CategoriesListView(APIView):
    def get(self, request):
        categories = Categories.objects.all()
        serializer = CategoriesSerializer(categories, many=True)
        return Response(serializer.data)
    
class EventRegistrationCreateView(generics.ListCreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.validated_data['event']
        if event.available_spots > 0:
            serializer.save(user=user)
            event.available_spots -= 1
            event.save()
        else:
            raise serializers.ValidationError({"detail": "Brak dostępnych miejsc na to wydarzenie."})
