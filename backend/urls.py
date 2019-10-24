from django.contrib import admin
from django.urls import path
from .views import index
urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
]