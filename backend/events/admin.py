from django.contrib import admin
from .models import Event

@admin.register(Event)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'event_date', 'location', 'description', 'created_by', 'max_participants', 'available_spots')  
    search_fields = ('title', 'location') 