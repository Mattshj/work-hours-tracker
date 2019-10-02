from django.db import models


class JobBox(models.Model):
    title = models.CharField(max_length=120)
    initial_time = models.DateTimeField()


class Job(models.Model):
    title = models.CharField(max_length=120)
    # box_id = models.DecimalField(decimal_places=2, max_digits=20)
    initial_time = models.DateTimeField()
    finish_time = models.DateTimeField()
    # jobBox = models.ForeignKey(JobBox, on_delete=models.CASCADE)

#
# class User(models.Model):
#     FirstName = models.TextField()
#     LastName = models.TextField()
#     Email = models.TextField()
#     Password = models.CharField(max_length=200)
#     Picture = models.TextField()
#     PhoneNumber = models.TextField()