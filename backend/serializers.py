from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Table
from .models import Lista

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id','url', 'username', 'email', 'groups']

class ListaSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lista
        fields = ['id','name','id_table']
    
    def to_representation(self, instance):
        return {'id': instance.id, 'name': instance.name}
    
    
class TablesSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id','name', 'visibility']


class TableDetailsSerializer(serializers.ModelSerializer):
    listy = ListaSimpleSerializer(many=True)

    class Meta:
        model = Table
        fields = ['id','name', 'visibility','listy']    