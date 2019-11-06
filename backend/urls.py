from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('tables/', TableList.as_view()),
    path('table/<int:pk>', TableDetail.as_view()),
    path('lists/', ListaList.as_view()),
    path('list/<int:pk>', ListaDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)