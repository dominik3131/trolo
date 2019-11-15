from django.db import models
from django.urls import reverse
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

class Team(models.Model):
    name = models.CharField(max_length=100)
    id_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_admin_id')
    users = models.ManyToManyField(User, related_name='users_in_team')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("team_detail", kwargs={"pk": self.pk})


class Table(models.Model):
    VISIBILITY = (
        (0, 'Private'),
        (1, 'Team'),
        (2, 'Public'),
    )
    name = models.CharField(max_length=100)
    visibility = models.IntegerField(default=0, choices=VISIBILITY)
    last_open = models.DateTimeField(blank=True, null=True)
    last_modyfied = models.DateTimeField(blank=True, null=True)
    favourite = models.BooleanField(default=False)
    background = models.CharField(max_length=200,default=None, blank=True, null=True)
    id_team = models.ForeignKey(Team, on_delete=models.CASCADE,related_name='team_id')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("table_detzail", kwargs={"pk": self.pk})


class Lista(models.Model):
    name = models.CharField(max_length=100)
    id_table = models.ForeignKey(Table, related_name='listy', on_delete=models.CASCADE)
    lookup_field = "name"
    
    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("list_detail", kwargs={"pk": self.name})

    class Meta: 
        verbose_name = "Lista"
        verbose_name_plural = "Listy"



class Card(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500,default=None, blank=True, null=True)
    active_to = models.DateTimeField(default=None, blank=True, null=True)
    id_list = models.ForeignKey(Lista, related_name='cards',on_delete=models.CASCADE)
    lookup_field = "name"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("card_detail", kwargs={"pk": self.pk})



class Label(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(validators=[RegexValidator('#\d{6}', message='Not a hex color', code='nomatch')], max_length=7)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("label_detail", kwargs={"pk": self.pk})
