from django.contrib import admin
from django.urls import path
from .views import index,TablesAllView
urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
     path('tables/', TablesAllView.as_view(), name="tables-all")
]