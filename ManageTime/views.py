from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils import timezone
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Job, JobBox
from .forms import JobForm, JobBoxForm, QuickJobForm


class HomeView(ListView):
    """Main dashboard view showing jobs and job packages."""
    
    model = Job
    template_name = 'home.html'
    context_object_name = 'jobs'
    paginate_by = 10

    def get_queryset(self):
        """Get recent jobs ordered by start time."""
        return Job.objects.select_related('job_box').order_by('-start_time')

    def get_context_data(self, **kwargs):
        """Add additional context data."""
        context = super().get_context_data(**kwargs)
        context['job_packages'] = JobBox.objects.filter(is_active=True).order_by('-created_at')
        context['quick_job_form'] = QuickJobForm()
        context['job_box_form'] = JobBoxForm()
        
        # Add statistics
        context['total_jobs'] = Job.objects.count()
        context['active_jobs'] = Job.objects.filter(end_time__isnull=True).count()
        context['completed_jobs'] = Job.objects.filter(is_completed=True).count()
        
        return context


class JobCreateView(CreateView):
    """View for creating new jobs."""
    
    model = Job
    form_class = JobForm
    template_name = 'job_form.html'
    success_url = reverse_lazy('managetime:home')

    def form_valid(self, form):
        """Handle successful form submission."""
        messages.success(self.request, 'Job created successfully!')
        return super().form_valid(form)

    def form_invalid(self, form):
        """Handle form validation errors."""
        messages.error(self.request, 'Please correct the errors below.')
        return super().form_invalid(form)


class JobUpdateView(UpdateView):
    """View for updating existing jobs."""
    
    model = Job
    form_class = JobForm
    template_name = 'job_form.html'
    success_url = reverse_lazy('managetime:home')

    def form_valid(self, form):
        """Handle successful form submission."""
        messages.success(self.request, 'Job updated successfully!')
        return super().form_valid(form)


class JobDeleteView(DeleteView):
    """View for deleting jobs."""
    
    model = Job
    success_url = reverse_lazy('managetime:home')

    def delete(self, request, *args, **kwargs):
        """Handle job deletion."""
        messages.success(request, 'Job deleted successfully!')
        return super().delete(request, *args, **kwargs)


class JobBoxCreateView(CreateView):
    """View for creating new job packages."""
    
    model = JobBox
    form_class = JobBoxForm
    template_name = 'jobbox_form.html'
    success_url = reverse_lazy('managetime:home')

    def form_valid(self, form):
        """Handle successful form submission."""
        messages.success(self.request, 'Job package created successfully!')
        return super().form_valid(form)


@require_http_methods(["POST"])
def quick_start_job(request):
    """Quickly start a new job with minimal data."""
    form = QuickJobForm(request.POST)
    
    if form.is_valid():
        job = Job.objects.create(
            title=form.cleaned_data['title'],
            start_time=timezone.now(),
            job_box=form.cleaned_data.get('job_box')
        )
        return JsonResponse({
            'success': True,
            'message': 'Job started successfully!',
            'job_id': job.id
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': form.errors
        })


@require_http_methods(["POST"])
def stop_job(request, job_id):
    """Stop an active job."""
    job = get_object_or_404(Job, id=job_id, end_time__isnull=True)
    job.end_time = timezone.now()
    job.save()
    
    return JsonResponse({
        'success': True,
        'message': 'Job stopped successfully!',
        'duration': str(job.duration)
    })


def job_detail(request, job_id):
    """View for displaying job details."""
    job = get_object_or_404(Job, id=job_id)
    return render(request, 'job_detail.html', {'job': job})


def job_package_detail(request, package_id):
    """View for displaying job package details."""
    package = get_object_or_404(JobBox, id=package_id)
    jobs = package.jobs.all().order_by('-start_time')
    
    context = {
        'package': package,
        'jobs': jobs,
        'total_duration': package.total_duration
    }
    return render(request, 'job_package_detail.html', context)
