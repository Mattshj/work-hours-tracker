from django import template
from datetime import timedelta

register = template.Library()

@register.filter
def format_duration(duration):
    """Format a timedelta object as a human-readable duration string."""
    if not duration:
        return "-"
    
    total_seconds = int(duration.total_seconds())
    
    if total_seconds < 60:
        return f"{total_seconds}s"
    
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    
    if hours > 0:
        if minutes > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{hours}h"
    elif minutes > 0:
        if seconds > 0:
            return f"{minutes}m {seconds}s"
        else:
            return f"{minutes}m"
    else:
        return f"{seconds}s"

@register.filter
def format_duration_hours(duration):
    """Format a timedelta object as hours with decimal places."""
    if not duration:
        return "0h"
    
    total_hours = duration.total_seconds() / 3600
    return f"{total_hours:.1f}h"

@register.filter
def format_duration_compact(duration):
    """Format a timedelta object as a compact duration string."""
    if not duration:
        return "-"
    
    total_seconds = int(duration.total_seconds())
    
    if total_seconds < 60:
        return f"{total_seconds}s"
    
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    
    if hours > 0:
        return f"{hours}h{minutes:02d}m"
    else:
        return f"{minutes}m"
