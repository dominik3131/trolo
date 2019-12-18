from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.decorators import  permission_classes,api_view
from rest_auth.views import LoginView
# Serve Single Page Application
index = never_cache(TemplateView.as_view(template_name='index.html'))

from rest_framework import generics
from .models import *
from .serializers import *
from .custom_permissions import CanGetTable,CanGetList
from rest_framework.generics import CreateAPIView
from rest_framework import permissions
from django.db.models import Q


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
    serializer_class = TablesSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(id_owner = user).exclude(is_closed = True)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(id_owner=user)


@permission_classes([CanGetTable])
class TableDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/tables/:table_id
    Method: GET/PUT/PATCH/DELETE
    '''
    queryset = Table.objects.all()
    serializer_class = TableDetailsSerializer

class ListaList(generics.ListCreateAPIView):
    '''
    API: /api/lists/
    Method: GET/POST
    '''

    serializer_class = ListaSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Lista.objects.filter(id_table__id_owner= user)


class ListaDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/lists/:list_id
    Method: GET/PUT/PATCH/DELETE
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
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(Q(id_list__id_table__id_owner= user)| Q(is_shared = True))

class CardDetail(MethodSerializerView, generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/cards/:card_id
    Method: GET/PUT/PATCH/DELETE
    '''
    queryset = Card.objects.all()
    method_serializer_classes = {
        ('GET', ): CardDetailsSerializer,
        ('PUT', 'PATCH'): CardSimpleSerializer
    }
    def get_queryset(self):
        user = self.request.user
        return  Card.objects.filter(Q(id_list__id_table__id_owner= user)| Q(is_shared = True))

class CreateUserView(CreateAPIView):

    model = get_user_model()
    permission_classes = [
        permissions.AllowAny # Or anon users can't register
    ]
    serializer_class = UserSerializer

class CustomLoginView(LoginView):
    def get_response(self):
        orginal_response = super().get_response()
        mydata = {"message": "some message", "status": "success"}
        orginal_response.data.update(mydata)
        return orginal_response

class AttachmentList(generics.CreateAPIView):
    '''
    API: /api/attachments/
    Method: POST
    Description: Add attachment to card.
    '''
    queryset = Card.objects.all()
    serializer_class = AttachmentSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(id_list__id_table__id_owner= user)

class AttachmentDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/attachments/:attachment_id
    Method: GET/PUT/PATCH/DELETE
    Description: Get, update or delete attachment by its id.
    '''
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSimpleSerializer

class CardsAttachmentList(generics.ListAPIView):
    '''
    API: /api/cards/attachments/:card_id
    Method: GET
    Description: Get all attachments of a card by its id.
    '''
    serializer_class = AttachmentSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Attachment.objects.filter(Q(card_id__id_list__id_table__id_owner = user) | Q(card_id__is_shared=True)).filter(card_id=self.kwargs['pk'])

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/comments/:comment_id
    Method: GET/PUT/PATCH/DELETE
    Description: Get, update or delete comment by its id.
    '''
    queryset = Comment.objects.all()
    serializer_class = CommentSimpleSerializer

class CommentAdd(generics.CreateAPIView):
    '''
    API: /api/comments/
    Method: POST
    Description: Add comment to card.
    '''
    queryset = Comment.objects.all()
    serializer_class = CommentSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(card_id__id_list__id_table__id_owner= user)


class CardsCommentsList(generics.ListAPIView):
    '''
    API: /api/cards/comments/:card_id
    Method: GET
    Description: Get all comments of a card by its id.
    '''
    serializer_class = CommentSimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(Q(card_id__id_list__id_table__id_owner = user) | Q(card_id__is_shared=True)).filter(card_id=self.kwargs['pk'])


class LabelDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/labels/:label_id
    Method: GET/PUT/PATCH/DELETE
    Description: Get, update or delete one of available labels by its id.
    '''
    serializer_class = LabelTemplateSerializer
    def get_queryset(self):
        user = self.request.user
        return Label.objects.filter(id_table__id_owner = user)

class LabelsOfTable(generics.ListAPIView):
    '''
    API: /api/tables/labels/:table_id
    Method: GET
    Description: Get all label of a table by its id.

    '''
    serializer_class = LabelTemplateSerializer
    def get_queryset(self):
        user = self.request.user
        return Label.objects.filter(id_table__id_owner = user).filter(id_table=self.kwargs['pk'])

        
class ActivityCreate(generics.CreateAPIView):
    '''
    API: /api/activities/
    Method: POST
    Description: Add activity to card.
    '''
    queryset = Card.objects.all()
    serializer_class = ActivitySimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(id_list__id_table__id_owner= user)

class ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    API: /api/activities/:activity_id
    Method: GET/PUT/PATCH/DELETE
    Description: Get, update or delete activity by its id.
    '''
    queryset = Activity.objects.all()
    serializer_class = ActivitySimpleSerializer

class CardsActivitiesList(generics.ListAPIView):
    '''
    API: /api/cards/activities/:card_id
    Method: GET
    Description: Get all activities of a card by its id.
    '''
    serializer_class = ActivitySimpleSerializer
    def get_queryset(self):
        user = self.request.user
        return Activity.objects.filter(card_id__id_list__id_table__id_owner= user).filter(card_id=self.kwargs['pk'])

class CardAllActivitiesList(generics.ListAPIView):
    '''
    API: /api/cards/all_activities/:card_id
    Method: GET
    Description: Get all activities and comments of a card by its id and sorted by date.
    '''
    serializer_class = ActivitySimpleSerializer
    def get_queryset(self):
        user = self.request.user
        comments = Comment.objects.filter(card_id=self.kwargs['pk'])
        activities = Activity.objects.filter(card_id=self.kwargs['pk'])
        return comments.union(activities).filter(card_id__id_list__id_table__id_owner= user).order_by('-create_date')

class LabelCreate(generics.CreateAPIView):
    '''
    API: /api/labels/
    Method: POST
    Description: Add activity to card.
    '''
    queryset = Label.objects.all()
    serializer_class = LabelTemplateSerializer
