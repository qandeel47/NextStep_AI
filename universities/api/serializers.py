from rest_framework import serializers

from universities.models import University


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = [
            'id',
            'name',
            'website',
            'sector',
            'city',
            'province',
            'programs',
            'admission_criteria',
            'entry_tests',
            'merit_formula',
            'admission_intake',
            'scholarships',
            'contact',
            'source_url',
            'collected_by',
            'date_collected',
        ]
