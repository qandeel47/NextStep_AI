from rest_framework import serializers

from userprofile.models import SUBJECT_MARK_FIELDS, UserProfile

EDUCATION_LEVELS = {code for code, _ in UserProfile.EDUCATION_LEVEL_CHOICES}
BACKGROUNDS = {code for code, _ in UserProfile.BACKGROUND_CHOICES}


def mark_entry(obtained, total):
    percent = round(100.0 * float(obtained) / float(total), 2)
    return {
        'obtained': float(obtained),
        'total': float(total),
        'percent': percent,
    }


class UserProfileSerializer(serializers.ModelSerializer):
    level = serializers.CharField(source='education_level', allow_blank=True)
    background = serializers.CharField(allow_blank=True)
    marks = serializers.JSONField(required=False)

    class Meta:
        model = UserProfile
        fields = ['level', 'background', 'marks', 'profile_completed', 'updated_at']
        read_only_fields = ['profile_completed', 'updated_at']

    def validate_level(self, value):
        if value and value not in EDUCATION_LEVELS:
            raise serializers.ValidationError(
                'Education must be Matric, O-Level, Intermediate or A-Level.'
            )
        return value

    def validate_background(self, value):
        if value and value not in BACKGROUNDS:
            raise serializers.ValidationError('Select a valid academic background / stream.')
        return value

    def validate_marks(self, marks):
        cleaned = {}
        for subject, value in (marks or {}).items():
            if subject not in SUBJECT_MARK_FIELDS:
                raise serializers.ValidationError(f'Unknown subject: {subject}')
            if value is None or value == '':
                continue
            if isinstance(value, dict):
                obtained = value.get('obtained')
                total = value.get('total')
            else:
                obtained = value
                total = 100
            try:
                obtained = float(obtained)
                total = float(total)
            except (TypeError, ValueError):
                raise serializers.ValidationError(f'{subject}: enter obtained and total marks.')
            if total <= 0:
                raise serializers.ValidationError(f'{subject}: total marks must be greater than 0.')
            if obtained < 0:
                raise serializers.ValidationError(f'{subject}: obtained marks cannot be negative.')
            if obtained > total:
                raise serializers.ValidationError(f'{subject}: obtained marks cannot exceed total.')
            cleaned[subject] = mark_entry(obtained, total)
        return cleaned

    def to_representation(self, instance):
        data = super().to_representation(instance)
        out = {}
        for subject, value in (instance.marks or {}).items():
            if isinstance(value, dict):
                obtained = value.get('obtained')
                total = value.get('total') or 100
                percent = value.get('percent')
                if percent is None and obtained is not None and total:
                    percent = round(100.0 * float(obtained) / float(total), 2)
                out[subject] = {
                    'obtained': obtained,
                    'total': total,
                    'percent': percent,
                }
            else:
                out[subject] = mark_entry(value, 100)
        data['marks'] = out
        return data

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.profile_completed = bool(
            instance.education_level
            and instance.background
            and len(instance.marks or {}) >= 2
        )
        instance.save(update_fields=['profile_completed'])
        return instance
