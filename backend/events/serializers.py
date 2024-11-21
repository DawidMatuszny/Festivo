from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_date', 'location', 'description', 'created_by', 'tags']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user 

        event = Event.objects.create(**validated_data) 
        return event