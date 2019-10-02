from django.http import HttpResponse
from django.shortcuts import render

from ManageTime.models import Job, JobBox


def home(request):
    jobs = Job.objects.all()
    JobsBox = JobBox.objects.all()
    args = {
        'jobs': jobs,
        'jobsbox': JobsBox
    }
    return render(request, 'home.html', args)


def login(request):
    return HttpResponse("Login")
