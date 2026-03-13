from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password

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


# =========================
# USER
# =========================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MemberProfileViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.all()
    serializer_class = MemberProfileSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerSerializer


# =========================
# MEMBERSHIP PLAN
# =========================

class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [AllowAny]


# =========================
# CLASS SCHEDULE
# =========================

class ClassScheduleViewSet(viewsets.ModelViewSet):

    serializer_class = ClassScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        # Admin sees all classes
        if user.role == "admin":
            return ClassSchedule.objects.all()

        # Trainer sees only his classes
        if user.role == "trainer":
            try:
                trainer = TrainerProfile.objects.get(user=user)
                return ClassSchedule.objects.filter(trainer=trainer)
            except TrainerProfile.DoesNotExist:
                return ClassSchedule.objects.none()

        return ClassSchedule.objects.none()

    def perform_create(self, serializer):

        user = self.request.user

        if user.role == "trainer":
            try:
                trainer_profile = TrainerProfile.objects.get(user=user)
                serializer.save(trainer=trainer_profile)
            except TrainerProfile.DoesNotExist:
                raise Exception("Trainer profile not found. Please contact admin.")

        elif user.role == "admin":
            serializer.save()

    def perform_update(self, serializer):

        user = self.request.user

        if user.role == "trainer":
            trainer_profile = TrainerProfile.objects.get(user=user)
            serializer.save(trainer=trainer_profile)

        else:
            serializer.save()


# =========================
# BOOKINGS
# =========================

class BookingViewSet(viewsets.ModelViewSet):

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================
# ATTENDANCE
# =========================

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


# =========================
# WORKOUT SUGGESTIONS
# =========================

class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer


# =========================
# REGISTER
# =========================

@api_view(['POST'])
def register_user(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():

        role = request.data.get("role", "member")

        user = serializer.save(role=role)

        # create member profile
        if role == "member":
            MemberProfile.objects.create(user=user)

        # create trainer profile
        if role == "trainer":
            TrainerProfile.objects.create(user=user)

        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data
        }, status=201)

    return Response(serializer.errors, status=400)


# =========================
# LOGIN
# =========================

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


# =========================
# FORGOT PASSWORD
# =========================

@api_view(['POST'])
def forgot_password(request):

    email = request.data.get("email")
    new_password = request.data.get("new_password")

    try:
        user = User.objects.get(email=email)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"})

    except User.DoesNotExist:
        return Response({"error": "User with this email not found"}, status=404)