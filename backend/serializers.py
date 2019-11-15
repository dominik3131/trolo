from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

# Default serializer class to allow overriding methods
class CustomSerializer(serializers.ModelSerializer):

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(CustomSerializer, self).get_field_names(declared_fields, info)

        if getattr(self.Meta, 'extra_fields', None):
            return expanded_fields + self.Meta.extra_fields
        else:
            return expanded_fields

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id','url', 'username', 'email', 'groups']


class CardSimpleSerializer(CustomSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class CardDetailsSerializer(CustomSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class ListaSimpleSerializer(CustomSerializer):
    class Meta:
        model = Lista
        fields = '__all__'

class ListaDetailsSerializer(CustomSerializer):
    cards = CardSimpleSerializer(many=True)

    class Meta:
        model = Lista
        fields = '__all__'
        extra_fields = ['cards']


class TablesSimpleSerializer(CustomSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class TableDetailsSerializer(CustomSerializer):
    listy = ListaDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Table
        fields = '__all__'
        extra_fields = ['listy']

# class UserSerializer(serializers.ModelSerializer):
#     #snippets = serializers.PrimaryKeyRelatedField(many=True, queryset=Snippet.objects.all())

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'snippets']