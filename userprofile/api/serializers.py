from rest_framework import serializers

from userprofile.models import AcademicProfile


class AcademicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicProfile
        fields = ['level', 'background', 'marks', 'updated_at']
        read_only_fields = ['updated_at']
