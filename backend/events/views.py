from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, Categories, EventRegistration
from .serializers import EventSerializer, CategoriesSerializer, EventRegistrationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import get_object_or_404

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated] 

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    

class CategoriesListView(APIView):
    permission_classes = [AllowAny]
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

        if event.event_date < timezone.now():
            raise serializers.ValidationError({"detail": "Nie można zapisać się na wydarzenie, które już się odbyło."})

        if EventRegistration.objects.filter(user=user, event=event).exists():
            raise serializers.ValidationError({"detail": "Jesteś już zapisany na to wydarzenie."})

        if event.available_spots > 0:
            serializer.save(user=user)
            event.available_spots -= 1
            event.save()
        else:
            raise serializers.ValidationError({"detail": "Brak dostępnych miejsc na to wydarzenie."})


class EventSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        address = request.query_params.get('address', '').strip()
        date_from = request.query_params.get('date_from', '').strip()
        date_to = request.query_params.get('date_to', '').strip()

        events = Event.objects.all()

        if query:
            events = events.filter(title__icontains=query)

        if address:
            events = events.filter(address__icontains=address)

        if date_from:
            events = events.filter(event_date__gte=datetime.strptime(date_from, "%Y-%m-%d"))
        if date_to:
            events = events.filter(event_date__lte=datetime.strptime(date_to, "%Y-%m-%d"))

        events = events.filter(event_date__gte=datetime.now())

        events = events.order_by('event_date')

        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)    

class EventEditDeleteView(RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(created_by=user)
    

class EventDetailWithRegistrationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id, created_by=request.user)
        registrations = event.participants.all() 
        participants = [
            {
                "id": registration.user.id,
                "email": registration.user.email,
                "first_name": registration.user.first_name,
                "last_name": registration.user.last_name,
                "profile_picture": request.build_absolute_uri(registration.user.profile_picture.url) if registration.user.profile_picture else None,
            }
            for registration in registrations
        ]
        event_serializer = EventSerializer(event, context={"request": request})
        return Response({
            "event": event_serializer.data,
            "participants": participants
        })