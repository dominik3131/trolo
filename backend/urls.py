from django.contrib import admin
from django.urls import path,include
from django.contrib.auth import views as auth_views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_auth.views import LoginView, LogoutView
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
    path('api/o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/users/create', CreateUserView.as_view()),
    path('api/login/',LoginView.as_view(),name = 'login'),
    path('api/logout/',LogoutView.as_view(),name='logout'),
]

urlpatterns = format_suffix_patterns(urlpatterns)