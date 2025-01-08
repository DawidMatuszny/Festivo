from rest_framework import serializers
from .models import Event, Categories, EventRegistration
from django.utils import timezone
from datetime import timedelta

class EventSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_date', 'place', 'address', 'description', 'created_by', 'max_participants', 'available_spots', 'category', 'image']
        read_only_fields = ['created_at', 'created_by']
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'max_length': 'Tytuł jest za długi. Maksymalna długość to 255 znaków.'
                }
            },
            'place': {
                'error_messages': {
                    'max_length': 'Maksymalna długość to 255 znaków.'
                }
            },
            'address': {
                'error_messages': {
                    'max_length': 'Maksymalna długość to 255 znaków.'
                }
            },
        }

    def validate(self, attrs):
        if attrs['event_date'] < timezone.now() + timedelta(days=1):
            raise serializers.ValidationError({"event_date": "Podano błędną date!"})
        return attrs
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user 
        validated_data['available_spots'] = validated_data['max_participants']
        event = Event.objects.create(**validated_data)
        return event


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'name']


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'registered_at']
        read_only_fields = ['user', 'registered_at']