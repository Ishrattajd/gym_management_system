from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('trainer', 'Trainer'),
        ('member', 'Member'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username
    

class MemberProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    height = models.FloatField()
    weight = models.FloatField()
    goal = models.CharField(max_length=50)

    def __str__(self):
        return self.user.username
    
class Trainer(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    experience = models.IntegerField()
    rating = models.FloatField()

    def __str__(self):
        return self.name
    

class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    duration = models.IntegerField()   # days
    features = models.TextField()

    def __str__(self):
        return self.name
    

class ClassSchedule(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    class_type = models.CharField(max_length=100)
    capacity = models.IntegerField()

    def __str__(self):
        return f"{self.class_type} - {self.date}"
    

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    class_schedule = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.username} - {self.class_schedule}"
    

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.username} - {self.date}"
    

class WorkoutSuggestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal = models.CharField(max_length=100)
    suggestion = models.TextField()

    def __str__(self):
        return self.user.username
    
