from django.db import models


class JobBox(models.Model):
    Title = models.CharField(max_length=120)
    InitialTime = models.DateTimeField()


class Job(models.Model):
    Title = models.CharField(max_length=120)
    BoxId = models.DecimalField(decimal_places=2, max_digits=20)
    InitialTime = models.DateTimeField()
    FinishTime = models.DateTimeField()
    # jobBox = models.ForeignKey(JobBox, on_delete=models.CASCADE)


class User(models.Model):
    FirstName = models.TextField()
    LastName = models.TextField()
    Email = models.TextField()
    Password = models.CharField(max_length=200)
    Picture = models.TextField()
    PhoneNumber = models.TextField()