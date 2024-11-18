from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="Użytkownik z tym adresem e-mail już istnieje.")]
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password', 'confirm_password')

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną cyfrę.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_-]', value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jeden znak specjalny.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną małą literę.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną dużą literę.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirmPassword": "Hasła muszą być takie same."})
        return attrs

    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        return user