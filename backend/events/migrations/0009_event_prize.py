# Generated by Django 5.1.3 on 2025-01-14 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0008_alter_event_available_spots'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='prize',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
