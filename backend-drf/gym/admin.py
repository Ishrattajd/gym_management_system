from django.contrib import admin
from .models import (
    User,
    MemberProfile,
    Trainer,
    MembershipPlan,
    ClassSchedule,
    Booking,
    Attendance,
    WorkoutSuggestion
)

admin.site.register(User)
admin.site.register(MemberProfile)
admin.site.register(Trainer)
admin.site.register(MembershipPlan)
admin.site.register(ClassSchedule)
admin.site.register(Booking)
admin.site.register(Attendance)
admin.site.register(WorkoutSuggestion)