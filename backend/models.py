from django.db import models


class Table(models.Model):
    VISIBILITY = (
        (0, 'Private'),
        (1, 'Team'),
        (2, 'Public'),
    )
    name = models.CharField(max_length=100)
    visibility = models.IntegerField(default=0, choices=VISIBILITY)
    last_open = models.DateTimeField()
    last_modyfied = models.DateTimeField()
    favourite = models.BooleanField()
    background = models.CharField(max_length=200)
