from django.urls import path
from . import views

app_name = 'managetime'

urlpatterns = [
    # Main views
    path('', views.HomeView.as_view(), name='home'),
    
    # Job views
    path('job/create/', views.JobCreateView.as_view(), name='job_create'),
    path('job/<int:pk>/edit/', views.JobUpdateView.as_view(), name='job_edit'),
    path('job/<int:pk>/delete/', views.JobDeleteView.as_view(), name='job_delete'),
    path('job/<int:job_id>/', views.job_detail, name='job_detail'),
    
    # Job package views
    path('package/create/', views.JobBoxCreateView.as_view(), name='package_create'),
    path('package/<int:package_id>/', views.job_package_detail, name='package_detail'),
    
    # AJAX endpoints
    path('api/quick-start/', views.quick_start_job, name='quick_start_job'),
    path('api/job/<int:job_id>/stop/', views.stop_job, name='stop_job'),
]
