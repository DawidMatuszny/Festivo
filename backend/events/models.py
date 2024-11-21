from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    max_participants = models.PositiveIntegerField() 
    available_spots = models.PositiveIntegerField() 
    tags = models.ManyToManyField('Tag', related_name='events')

    def __str__(self):
        return f"{self.description} ({self.event_date})"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
