from django.contrib import admin
from django.urls import path,include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('api/tables/', TableList.as_view()),
    path('api/tables/<int:pk>', TableDetail.as_view()),
    path('api/lists/', ListaList.as_view()),
    path('api/lists/<int:pk>', ListaDetail.as_view()),
    path('api/cards/', CardList.as_view()),
    path('api/cards/<int:pk>', CardDetail.as_view()),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)