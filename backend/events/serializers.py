from rest_framework import serializers
from .models import Event
from django.utils import timezone

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_date', 'location', 'description', 'created_by', 'max_participants']
        read_only_fields = ['created_at', 'created_by']

    def validate(self, attrs):
        if attrs['event_date'] < timezone.now():
            raise serializers.ValidationError({"Zła data!"})
        return attrs
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user 
        validated_data['available_spots'] = validated_data['max_participants']

        event = Event.objects.create(**validated_data) 
        return event