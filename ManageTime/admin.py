from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Job, JobBox


@admin.register(JobBox)
class JobBoxAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'is_active', 'job_count', 'total_duration_display']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title']
    readonly_fields = ['created_at', 'updated_at', 'total_duration_display']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('total_duration_display',),
            'classes': ('collapse',)
        }),
    )
    
    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = 'Jobs Count'
    
    def total_duration_display(self, obj):
        duration = obj.total_duration
        hours = int(duration.total_seconds() // 3600)
        minutes = int((duration.total_seconds() % 3600) // 60)
        return f"{hours}h {minutes}m"
    total_duration_display.short_description = 'Total Duration'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_time', 'end_time', 'duration_display', 'job_box', 'is_completed', 'status_badge']
    list_filter = ['is_completed', 'job_box', 'start_time', 'end_time']
    search_fields = ['title', 'job_box__title']
    readonly_fields = ['created_at', 'updated_at', 'duration_display', 'status_badge']
    ordering = ['-start_time']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'job_box')
        }),
        ('Time Tracking', {
            'fields': ('start_time', 'end_time', 'is_completed')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('duration_display', 'status_badge'),
            'classes': ('collapse',)
        }),
    )
    
    def duration_display(self, obj):
        duration = obj.duration
        if duration.total_seconds() > 0:
            hours = int(duration.total_seconds() // 3600)
            minutes = int((duration.total_seconds() % 3600) // 60)
            return f"{hours}h {minutes}m"
        return "-"
    duration_display.short_description = 'Duration'
    
    def status_badge(self, obj):
        if obj.is_completed:
            return format_html(
                '<span style="color: #10b981; font-weight: bold;">✓ Completed</span>'
            )
        else:
            return format_html(
                '<span style="color: #f59e0b; font-weight: bold;">⏱ Active</span>'
            )
    status_badge.short_description = 'Status'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('job_box')


# Customize admin site
admin.site.site_header = "Work Hours Tracker Administration"
admin.site.site_title = "Work Hours Admin"
admin.site.index_title = "Welcome to Work Hours Tracker Administration"
