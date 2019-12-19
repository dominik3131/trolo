from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from rest_auth.views import LogoutView
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('login/', index, name='index'),
    path('logout/', index, name='index'),
    path('tables/', index, name='index'),
    path('tables/<int:pk>', index, name='index'),
    path('card/<uuid:pk>', index, name='index'),
    path('admin/', admin.site.urls),

    path('api/tables/', TableList.as_view()),
    path('api/tables/<int:pk>', TableDetail.as_view()),

    path('api/lists/', ListaList.as_view()),
    path('api/lists/<int:pk>', ListaDetail.as_view()),

    path('api/cards/', CardList.as_view()),
    path('api/cards/<uuid:pk>', CardDetail.as_view()),

    path('api/attachments/', AttachmentList.as_view()),
    path('api/attachments/<int:pk>', AttachmentDetail.as_view()),
    path('api/cards/attachments/<uuid:pk>', CardsAttachmentList.as_view()),

    path('api/cards/comments/<uuid:pk>', CardsCommentsList.as_view()),
    path('api/comments/<int:pk>', CommentDetail.as_view()),
    path('api/comments/', CommentAdd.as_view()),

    path('api/activities/', ActivityCreate.as_view()),
    path('api/activities/<int:pk>', ActivityDetail.as_view()),
    path('api/cards/activities/<uuid:pk>', CardsActivitiesList.as_view()),
    path('api/cards/all_activities/<uuid:pk>', CardAllActivitiesList.as_view()),

    path('api/labels', LabelCreate.as_view()),
    path('api/labels/<int:pk>', LabelDetail.as_view()),
    path('api/tables/labels/<int:pk>', LabelsOfTable.as_view()),

    path('api/o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/users/create', CreateUserView.as_view()),
    path('api/login/',LoginView.as_view(),name = 'login'),
    path('api/logout/',LogoutView.as_view(),name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)