from rest_framework import serializers

from scholarships.models import Scholarship


class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = [
            'id',
            'name',
            'provider',
            'website',
            'education_level',
            'province',
            'field_of_study',
            'eligibility',
            'coverage',
            'required_documents',
            'application_deadline',
            'application_process',
            'contact',
            'source_url',
            'collected_by',
            'date_collected',
            'min_marks',
        ]
