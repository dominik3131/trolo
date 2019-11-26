from rest_framework import permissions

class CanGetTable(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        #  return (request.user in obj.id_team.users.all()) 
        return request.user == obj.id_owner or request.user.is_superuser

class CanGetList(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        #  return (request.user in obj.id_table.id_team.users.all()) 
         return request.user == obj.id_table.id_owner or request.user.is_superuser

class CanGetCard(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        #  return (request.user in obj.id_list.id_table.id_team.users.all())
        return request.user == obj.id_list.id_table.id_owner or request.user.is_superuser

class CanGetAttachment(permissions.BasePermission):

        def has_object_permission(self, request, view, obj):
            return (request.user == obj.card_id.id_list.id_table.id_owner or request.user.is_superuser ) and obj.card_id == request.card_id