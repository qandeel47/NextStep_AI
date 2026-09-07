from rest_framework import serializers

from careerfields.models import CareerField


class CareerFieldSerializer(serializers.ModelSerializer):
    requiredSubjects = serializers.ListField(source='required_subjects', read_only=True)
    preferredLevels = serializers.ListField(source='preferred_levels', read_only=True)
    interestTags = serializers.ListField(source='interest_tags', read_only=True)
    demandLabel = serializers.CharField(source='demand_label', read_only=True)
    desc = serializers.CharField(source='short_desc', read_only=True)
    minBackground = serializers.ListField(source='min_background', read_only=True)
    marketOutlook = serializers.CharField(source='market_outlook', read_only=True)
    futureOutlook = serializers.CharField(source='future_outlook', read_only=True)
    fieldValue = serializers.CharField(source='field_value', read_only=True)
    jobTypes = serializers.ListField(source='job_types', read_only=True)
    studyRoadmap = serializers.ListField(source='study_roadmap', read_only=True)

    class Meta:
        model = CareerField
        fields = [
            'id',
            'name',
            'category',
            'requiredSubjects',
            'preferredLevels',
            'interestTags',
            'market',
            'future',
            'demandLabel',
            'duration',
            'desc',
            'about',
            'marketOutlook',
            'futureOutlook',
            'fieldValue',
            'learn',
            'skills',
            'careers',
            'jobTypes',
            'opportunities',
            'risks',
            'studyRoadmap',
            'minBackground',
        ]
