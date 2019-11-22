from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
# Serve Single Page Application
index = never_cache(TemplateView.as_view(template_name='index.html'))

from rest_framework import generics
from .models import *
from .serializers import *

class MethodSerializerView(object):
    '''
    Utility class for get different serializer class by method.
    For example:
    method_serializer_classes = {
        ('GET', ): MyModelListViewSerializer,
        ('PUT', 'PATCH'): MyModelCreateUpdateSerializer
    }
    '''
    method_serializer_classes = None

    def get_serializer_class(self):
        assert self.method_serializer_classes is not None, (
            'Expected view %s should contain method_serializer_classes '
            'to get right serializer class.' %
            (self.__class__.__name__, )
        )
        for methods, serializer_cls in self.method_serializer_classes.items():
            if self.request.method in methods:
                return serializer_cls

        raise exceptions.MethodNotAllowed(self.request.method)

class TableList(generics.ListCreateAPIView):
    '''
    API: /api/tables/
    Method: GET/POST
    '''
    queryset = Table.objects.all()
    serializer_class = TablesSimpleSerializer


class TableDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/tables/:table_id
    Method: GET/PUT/PATCH
    '''
    queryset = Table.objects.all()
    serializer_class = TableDetailsSerializer

class ListaList(generics.ListCreateAPIView):
    '''
    API: /api/lists/
    Method: GET/POST
    '''
    queryset = Lista.objects.all()
    serializer_class = ListaSimpleSerializer


class ListaDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/lists/:list_id
    Method: GET/PUT/PATCH
    '''
    queryset = Lista.objects.all()
    serializer_class = ListaDetailsSerializer


class CardList(generics.ListCreateAPIView):
    '''
    API: /api/cards/
    Method: GET/POST
    '''
    queryset = Card.objects.all()
    serializer_class = CardSimpleSerializer

class CardDetail(MethodSerializerView, generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/cards/:card_id
    Method: GET/PUT/PATCH
    '''
    queryset = Card.objects.all()
    method_serializer_classes = {
        ('GET', ): CardDetailsSerializer,
        ('PUT', 'PATCH'): CardSimpleSerializer
    }

