from django.db import models
from django.urls import reverse
from django.core.validators import RegexValidator

class User(models.Model):
    login = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    last_active = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("user_detail", kwargs={"pk": self.pk})


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
    last_open = models.DateTimeField()
    last_modyfied = models.DateTimeField()
    favourite = models.BooleanField(default=False)
    background = models.CharField(max_length=200)
    id_team = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("table_detail", kwargs={"pk": self.pk})


class List(models.Model):
    name = models.CharField(max_length=100)
    id_table = models.ForeignKey(Table, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("list_detail", kwargs={"pk": self.pk})



class Card(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    active_to = models.DateTimeField()
    id_list = models.ForeignKey(List,on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("card_detail", kwargs={"pk": self.pk})



class Label(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(validators=[RegexValidator("#\d{6}", message='Not a hex color', code='nomatch')], max_length=7)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("label_detail", kwargs={"pk": self.pk})
