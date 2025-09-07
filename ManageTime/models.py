from django.db import models
from django.core.validators import MinLengthValidator
from django.utils import timezone


class JobBox(models.Model):
    """Model representing a collection of related jobs."""
    
    title = models.CharField(
        max_length=120,
        validators=[MinLengthValidator(3)],
        help_text="Enter a descriptive title for the job package"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When this job package was created"
    )
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this job package is currently active"
    )

    class Meta:
        verbose_name = "Job Package"
        verbose_name_plural = "Job Packages"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def total_duration(self):
        """Calculate total duration of all jobs in this package."""
        total_seconds = sum(
            job.duration.total_seconds() 
            for job in self.jobs.filter(is_completed=True)
        )
        return timezone.timedelta(seconds=total_seconds)


class Job(models.Model):
    """Model representing a single work session."""
    
    title = models.CharField(
        max_length=120,
        validators=[MinLengthValidator(3)],
        help_text="Enter a descriptive title for this job"
    )
    start_time = models.DateTimeField(
        help_text="When the job started"
    )
    end_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the job ended (leave blank if ongoing)"
    )
    job_box = models.ForeignKey(
        JobBox,
        on_delete=models.CASCADE,
        related_name='jobs',
        null=True,
        blank=True,
        help_text="Optional job package this belongs to"
    )
    is_completed = models.BooleanField(
        default=False,
        help_text="Whether this job has been completed"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.title} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"

    @property
    def duration(self):
        """Calculate the duration of the job."""
        if self.end_time and self.start_time:
            return self.end_time - self.start_time
        elif self.start_time:
            return timezone.now() - self.start_time
        return timezone.timedelta(0)

    def save(self, *args, **kwargs):
        """Override save to automatically set completion status."""
        if self.end_time and not self.is_completed:
            self.is_completed = True
        super().save(*args, **kwargs)

    def clean(self):
        """Validate the model data."""
        from django.core.exceptions import ValidationError
        
        if self.end_time and self.start_time and self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time.")