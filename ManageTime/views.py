from django.http import HttpResponse
from django.shortcuts import render

from ManageTime.models import Job, JobBox


def home1(request, box_id):
    jobs = Job.objects.all()
    try:
        jobs_box = JobBox.objects.filter(pk=box_id).values()
    except JobBox.DoesNotExist:
        # not_exit_text = "بسته مورد نظر وجود ندارد"
        jobs_box = None
    args = {
        'jobs': jobs,
        'jobs_box': jobs_box,
        'box_id': box_id
    }
    return render(request, 'home.html', args)


def home(request):
    jobs = Job.objects.all()
    jobs_box = JobBox.objects.all()
    args = {
        'jobs': jobs,
        'jobs_box': jobs_box,
    }
    return render(request, 'home.html', args)


def login(request):
    return HttpResponse("Login")

