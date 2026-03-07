from rest_framework import serializers
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

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = MemberProfile
        fields = '__all__'


# -------------------------------
# TRAINER SERIALIZER
# -------------------------------
class TrainerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trainer
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

    trainer = serializers.StringRelatedField()

    class Meta:
        model = ClassSchedule
        fields = '__all__'


# -------------------------------
# BOOKING SERIALIZER
# -------------------------------
class BookingSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(read_only=True)
    class_schedule = serializers.StringRelatedField()

    class Meta:
        model = Booking
        fields = '__all__'


# -------------------------------
# ATTENDANCE SERIALIZER
# -------------------------------
class AttendanceSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = Attendance
        fields = '__all__'


# -------------------------------
# WORKOUT SUGGESTION SERIALIZER
# -------------------------------
class WorkoutSuggestionSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = WorkoutSuggestion
        fields = '__all__'