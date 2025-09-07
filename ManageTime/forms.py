from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Job, JobBox


class JobForm(forms.ModelForm):
    """Form for creating and editing jobs."""
    
    class Meta:
        model = Job
        fields = ['title', 'start_time', 'end_time', 'job_box']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter job title',
                'required': True
            }),
            'start_time': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local',
                'required': True
            }),
            'end_time': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'job_box': forms.Select(attrs={
                'class': 'form-control'
            })
        }
        labels = {
            'title': 'Job Title',
            'start_time': 'Start Time',
            'end_time': 'End Time',
            'job_box': 'Job Package'
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only show active job boxes
        self.fields['job_box'].queryset = JobBox.objects.filter(is_active=True)
        self.fields['job_box'].empty_label = "Select a job package (optional)"

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get('start_time')
        end_time = cleaned_data.get('end_time')

        if start_time and end_time and end_time <= start_time:
            raise ValidationError("End time must be after start time.")

        if start_time and start_time > timezone.now():
            raise ValidationError("Start time cannot be in the future.")

        return cleaned_data


class JobBoxForm(forms.ModelForm):
    """Form for creating and editing job packages."""
    
    class Meta:
        model = JobBox
        fields = ['title']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter job package title',
                'required': True
            })
        }
        labels = {
            'title': 'Package Title'
        }

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if title and len(title.strip()) < 3:
            raise ValidationError("Title must be at least 3 characters long.")
        return title.strip()


class QuickJobForm(forms.Form):
    """Quick form for starting a new job."""
    
    title = forms.CharField(
        max_length=120,
        min_length=3,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter new job title',
            'required': True
        }),
        label='Job Title'
    )
    job_box = forms.ModelChoiceField(
        queryset=JobBox.objects.filter(is_active=True),
        required=False,
        empty_label="Select a job package (optional)",
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        label='Job Package'
    )

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if title and len(title.strip()) < 3:
            raise ValidationError("Title must be at least 3 characters long.")
        return title.strip()
