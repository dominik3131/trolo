from django.contrib import admin
from .models import Team
from .models import Table
from .models import Lista
from .models import Card
from .models import Label
from .models import Attachment

admin.site.register(Team)
admin.site.register(Table)
admin.site.register(Lista)
admin.site.register(Card)
admin.site.register(Label)
admin.site.register(Attachment)