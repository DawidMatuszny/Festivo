# Generated by Django 5.1.3 on 2025-01-14 19:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_event_prize'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='prize',
            new_name='price',
        ),
    ]
