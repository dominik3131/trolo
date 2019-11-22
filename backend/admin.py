from django.contrib import admin
from .models import Team
from .models import Table
from .models import Lista
from .models import Card
from .models import Label
from .models import Attachment
from django.contrib.admin.views.main import ChangeList
from .forms import TeamChangeListForm

admin.site.register(Team)
admin.site.register(Table)
admin.site.register(Lista)
admin.site.register(Card)
admin.site.register(Label)
admin.site.register(Attachment)

class TeamChangeList(ChangeList):
    def __init__(self, request, model, list_display,
                 list_display_links, list_filter, date_hierarchy,
                 search_fields, list_select_related, list_per_page,
                 list_max_show_all, list_editable, model_admin):
        super(TeamChangeList, self).__init__(request, model,
                                            list_display, list_display_links, list_filter,
                                            date_hierarchy, search_fields, list_select_related,
                                            list_per_page, list_max_show_all, list_editable,
                                            model_admin)

        # these need to be defined here, and not in MovieAdmin
        self.list_display = ['action_checkbox', 'username', 'user']
        self.list_display_links = ['username']
        self.list_editable = ['user']


class TeamAdmin(admin.ModelAdmin):

    def get_changelist(self, request, **kwargs):
        return TeamChangeList

    def get_changelist_form(self, request, **kwargs):
        return TeamChangeListForm
