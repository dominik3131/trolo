from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
# Serve Single Page Application
index = never_cache(TemplateView.as_view(template_name='index.html'))


from rest_framework import generics
from .models import Table
from .serializers import TableSerializer


class TablesAllView(generics.ListAPIView):
    """
    Provides a get method handler.
    """
    queryset = Table.objects.all()
    serializer_class = TableSerializer