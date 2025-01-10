from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField()
    place = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    max_participants = models.PositiveIntegerField() 
    available_spots = models.PositiveIntegerField(null=True) 
    category = models.ForeignKey('Categories', related_name='events', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='events/', null=True, blank=True)

    def __str__(self):
        return self.title

class Categories(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class EventRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
            unique_together = ('user', 'event')
