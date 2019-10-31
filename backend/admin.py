from django.contrib import admin
from .models import Team
from .models import User
from .models import Table
from .models import List
from .models import Card
from .models import Label

admin.site.register(Team)
admin.site.register(User)
admin.site.register(Table)
admin.site.register(List)
admin.site.register(Card)
admin.site.register(Label)