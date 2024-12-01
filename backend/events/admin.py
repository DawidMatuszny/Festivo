from django.contrib import admin
from .models import Event, Categories, EventRegistration

@admin.register(Event)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'event_date', 'place', 'address', 'description', 'created_by', 'max_participants', 'available_spots', 'category')  
    search_fields = ('title', 'place')


@admin.register(Categories)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(EventRegistration)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'event')
    search_fields = ('user', 'event')

    