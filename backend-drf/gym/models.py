from django.db import models
from django.contrib.auth.models import AbstractUser


# -------------------------------
# USER MODEL
# -------------------------------

class User(AbstractUser):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('trainer', 'Trainer'),
        ('member', 'Member'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username


# -------------------------------
# MEMBERSHIP PLAN
# -------------------------------

class MembershipPlan(models.Model):

    name = models.CharField(max_length=100)
    price = models.FloatField()
    duration = models.IntegerField()  # days
    features = models.TextField()

    def __str__(self):
        return self.name


# -------------------------------
# MEMBER PROFILE
# -------------------------------

class MemberProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    goal = models.CharField(max_length=50, blank=True, null=True)

    membership_plan = models.ForeignKey(
        MembershipPlan,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    status = models.CharField(max_length=20, default="Active")

    def __str__(self):
        return self.user.username
    


# -------------------------------
# TRAINER
# -------------------------------

class TrainerProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone = models.CharField(max_length=15, blank=True, null=True)

    specialization = models.CharField(max_length=100, blank=True, null=True)

    experience = models.IntegerField(default=0)

    bio = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username
# -------------------------------
# CLASS SCHEDULE
# -------------------------------

class ClassSchedule(models.Model):

    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    class_type = models.CharField(max_length=100)
    capacity = models.IntegerField()

    def __str__(self):
        return f"{self.class_type} - {self.date}"


# -------------------------------
# BOOKING
# -------------------------------

class Booking(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    class_schedule = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.username} - {self.class_schedule}"


# -------------------------------
# ATTENDANCE
# -------------------------------

class Attendance(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(
    max_length=20,
    choices=[
        ("Present", "Present"),
        ("Absent", "Absent")
    ]
    )

    def __str__(self):
        return f"{self.user.username} - {self.date}"


# -------------------------------
# WORKOUT SUGGESTION
# -------------------------------

class WorkoutSuggestion(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal = models.CharField(max_length=100)
    suggestion = models.TextField()

    def __str__(self):
        return self.user.username