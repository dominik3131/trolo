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
    API: /tables/
    Method: GET/PUT/PATCH
    '''
    queryset = Table.objects.all()
    serializer_class = TablesSimpleSerializer


class TableDetail(MethodSerializerView, generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /table/:table_id
    Method: GET/PUT/PATCH
    '''
    queryset = Table.objects.all()
    method_serializer_classes = {
        ('GET', ): TableDetailsSerializer,
        ('PUT', 'PATCH'): TablesSimpleSerializer
    }

class ListObjList(generics.ListCreateAPIView):
    '''
    API: /lists/
    Method: GET/PUT/PATCH
    '''
    queryset = Lista.objects.all()
    serializer_class = ListSimpleSerializer


class ListObjDetail(MethodSerializerView, generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /list/:list_id
    Method: GET/PUT/PATCH
    '''
    queryset = Lista.objects.all()
    method_serializer_classes = {
        ('GET', ): ListSimpleSerializer,
        ('PUT', 'PATCH'): ListSimpleSerializer
    }
