from rest_framework import permissions

class CanGetTable(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        return (request.user in obj.id_team.users.all()) 

class CanGetList(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        return (request.user in obj.id_table.id_team.users.all()) 

class CanGetCard(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #if request.method in permissions.SAFE_METHODS:
        #    return True
        # Instance must have an attribute named `owner`.
        return (request.user in obj.id_list.id_table.id_team.users.all()) 