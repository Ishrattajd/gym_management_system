from rest_framework import serializers
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


# -------------------------------
# USER SERIALIZER
# -------------------------------
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'role'
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# -------------------------------
# MEMBER PROFILE SERIALIZER
# -------------------------------
class MemberProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    plan_name = serializers.CharField(
        source="membership_plan.name",
        read_only=True
    )

    class Meta:
        model = MemberProfile
        fields = [
            "id",
            "user",
            "username",
            "email",
            "phone",
            "age",
            "height",
            "weight",
            "goal",
            "membership_plan",
            "plan_name",
            "status",
        ]
# -------------------------------
# TRAINER SERIALIZER
# -------------------------------
class TrainerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainerProfile
        fields = '__all__'


# -------------------------------
# MEMBERSHIP PLAN SERIALIZER
# -------------------------------
class MembershipPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = MembershipPlan
        fields = '__all__'


# -------------------------------
# CLASS SCHEDULE SERIALIZER
# -------------------------------
class ClassScheduleSerializer(serializers.ModelSerializer):

    trainer_name = serializers.CharField(source="trainer.user.username", read_only=True)

    class Meta:
        model = ClassSchedule
        fields = [
            "id",
            "trainer",
            "trainer_name",
            "class_type",
            "date",
            "time",
            "capacity",
        ]

        read_only_fields = ["trainer"]

# -------------------------------
# BOOKING SERIALIZER
# -------------------------------
class BookingSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)
    class_name = serializers.CharField(source="class_schedule.class_type", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "user_name",
            "class_schedule",
            "class_name",
            "status",
        ]

        # 🔹 important fix
        read_only_fields = ["user"]

# -------------------------------
# ATTENDANCE SERIALIZER
# -------------------------------
class AttendanceSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id",
            "user",
            "user_name",
            "date",
            "status"
        ]

# -------------------------------
# WORKOUT SUGGESTION SERIALIZER
# -------------------------------
class WorkoutSuggestionSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = WorkoutSuggestion
        fields = '__all__'