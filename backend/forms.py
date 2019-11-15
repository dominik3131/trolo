from django import forms
from .models import User


class TeamChangeListForm(forms.ModelForm):
    # here we only need to define the field we want to be editable
    genre = forms.ModelMultipleChoiceField(
        queryset = User.objects.all(), required=False)