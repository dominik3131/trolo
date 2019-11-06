from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Table
from .models import List

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class TablesSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['name', 'visibility']

class TableDetailsSerializer(serializers.ModelSerializer):
    lists = serializers.RelatedField(source='list', read_only=True)
    
    class Meta:
        model = Table
        fields = ['name', 'visibility','lists']


class ListSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['name','id_table']
    
        