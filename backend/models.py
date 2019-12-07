from django.db import models
from django.urls import reverse
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

default_labels_colors = ['#f54242','#f59c42','#f7db07','#57f707','#076ff7','#f707e7']

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
    description = models.CharField(max_length=200,default=None, blank=True, null=True)
    visibility = models.IntegerField(default=0, choices=VISIBILITY)
    last_open = models.DateTimeField(blank=True, null=True)
    last_modyfied = models.DateTimeField(blank=True, null=True)
    favourite = models.BooleanField(default=False)
    background = models.CharField(max_length=200,default=None, blank=True, null=True)
    is_closed = models.BooleanField(default=False)
    id_team = models.ForeignKey(Team, on_delete=models.CASCADE,related_name='team_id', blank=True, null=True)
    id_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='table_owner',default=-1)


    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("table_detzail", kwargs={"pk": self.pk})


# when new table is created adds default labels
@receiver(post_save, sender=Table)
def add_default_labels_after_table_created(sender, instance, created, **kwargs):
    if created:
        for color  in default_labels_colors:
            Label.objects.create(name=str(instance.id) +'_'+ color ,color=color,id_table=instance)

class Lista(models.Model):
    name = models.CharField(max_length=100)
    id_table = models.ForeignKey(Table, related_name='listy', on_delete=models.CASCADE)
    is_archive =  models.BooleanField(default=False)
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
    is_archive =  models.BooleanField(default=False)
    id_list = models.ForeignKey(Lista, related_name='cards',on_delete=models.CASCADE)
    lookup_field = "name"
    labels = models.ManyToManyField("backend.Label", related_name='labels')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("card_detail", kwargs={"pk": self.pk})


class Attachment(models.Model):
    file_name = models.CharField(max_length=50)
    attached_file = models.FileField(upload_to ='attachments/%Y/%m/%D/')
    card_id = models.ForeignKey(Card, on_delete=models.CASCADE,related_name='attachments')

    def __str__(self):
        return self.file_name

    def get_absolute_url(self):
        return reverse("attachment_detail", kwargs={"pk": self.pk})


class Comment(models.Model):
    content = models.CharField(max_length=1000)
    card_id = models.ForeignKey(Card, on_delete=models.CASCADE,related_name='comments')

class Label(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(validators=[RegexValidator('#\d{6}', message='Not a hex color', code='nomatch')], max_length=7)
    id_table = models.ForeignKey(Table,on_delete = models.CASCADE,related_name='labels',null=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("label_detail", kwargs={"pk": self.pk})