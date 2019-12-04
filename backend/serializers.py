from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model 
from .models import *


UserModel = get_user_model()

class CustomSerializer(serializers.ModelSerializer):

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(CustomSerializer, self).get_field_names(declared_fields, info)

        if getattr(self.Meta, 'extra_fields', None):
            return expanded_fields + self.Meta.extra_fields
        else:
            return expanded_fields


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = UserModel.objects.create(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = UserModel
        # Tuple of serialized model fields (see link [2])
        fields = ( "id", "username", "password", )



class AttachmentSimpleSerializer(CustomSerializer):
    
    class Meta:
        model = Attachment
        fields = '__all__'

class CardSimpleSerializer(CustomSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class CommentSimpleSerializer(CustomSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        
class CardDetailsSerializer(CustomSerializer):
    attachments = AttachmentSimpleSerializer(many=True, read_only=True)
    comments = CommentSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = '__all__'
        extra_fields = ['attachments', 'comments']


class ListaSimpleSerializer(CustomSerializer):
    class Meta:
        model = Lista
        fields = '__all__'

class ListaDetailsSerializer(CustomSerializer):
    cards = CardDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Lista
        fields = '__all__'
        extra_fields = ['cards']


class TablesSimpleSerializer(CustomSerializer):
    
    class Meta:
        model = Table
        fields = '__all__'
        read_only_fields = ['id_owner']

class TableDetailsSerializer(CustomSerializer):
    listy = ListaDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Table
        fields = '__all__'
        extra_fields = ['listy']

