from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    User,
    MemberProfile,
    TrainerProfile,
    MembershipPlan,
    ClassSchedule,
    Booking,
    Attendance,
    WorkoutSuggestion
)

from .serializers import (
    UserSerializer,
    MemberProfileSerializer,
    TrainerSerializer,
    MembershipPlanSerializer,
    ClassScheduleSerializer,
    BookingSerializer,
    AttendanceSerializer,
    WorkoutSuggestionSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MemberProfileViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.all()
    serializer_class = MemberProfileSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerSerializer


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer


class ClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer

    def perform_create(self, serializer):
        trainer_profile = TrainerProfile.objects.get(user=self.request.user)
        serializer.save(trainer=trainer_profile)

    def perform_update(self, serializer):
        trainer_profile = TrainerProfile.objects.get(user=self.request.user)
        serializer.save(trainer=trainer_profile)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    # 🔹 automatically attach logged in user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # 🔹 show only bookings of logged in user
    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(user=user)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer


@api_view(['POST'])
def register_user(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():

        role = request.data.get("role", "member")

        user = serializer.save(role=role)

        if role == "member":
            MemberProfile.objects.create(user=user)

        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data
        }, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login_user(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "role": user.role,
            "username": user.username,
            "email": user.email
        })

    return Response({"error": "Invalid credentials"}, status=401)