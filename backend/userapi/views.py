from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser
from events.models import Event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from events.serializers import EventSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"general": "Niepoprawny email lub hasło."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
class LoggedUserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        events = user.event_registrations.all().values_list('event', flat=True)
        event_objects = Event.objects.filter(id__in=events)
        serializer = EventSerializer(event_objects, many=True)
        return Response(serializer.data)


class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.profile_picture = request.FILES['profile_picture']
        user.save()
        return Response({"profile_picture": user.profile_picture.url})

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"error": "Oba pola: 'obecne hasło' i 'nowe hasło' są wymagane."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Nieprawidłowe obecne hasło."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer()
        try:
            serializer.validate_password(new_password)
        except serializers.ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Hasło zostało zmienione pomyślnie."}, status=status.HTTP_200_OK)
    
class UserCreatedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        events = Event.objects.filter(created_by=user)
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)