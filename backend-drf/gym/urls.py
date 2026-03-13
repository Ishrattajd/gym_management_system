from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *
from .views import forgot_password

router = DefaultRouter()

router.register('users', UserViewSet)
router.register('members', MemberProfileViewSet)
router.register('trainers', TrainerViewSet)
router.register('plans', MembershipPlanViewSet)
router.register('classes', ClassScheduleViewSet, basename='classes')
router.register('bookings', BookingViewSet)
router.register('attendance', AttendanceViewSet)
router.register('workouts', WorkoutSuggestionViewSet)

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('forgot-password/', forgot_password),
]

urlpatterns += router.urls