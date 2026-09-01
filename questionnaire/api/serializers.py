from rest_framework import serializers

from questionnaire.models import Question, QuestionOption


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'label', 'tag', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'hint', 'order', 'options']


class AnswerItemSerializer(serializers.Serializer):
    question = serializers.IntegerField()
    option_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)


class SubmitAnswersSerializer(serializers.Serializer):
    answers = AnswerItemSerializer(many=True)

    def validate_answers(self, answers):
        question_ids = [item['question'] for item in answers]
        if len(question_ids) != len(set(question_ids)):
            raise serializers.ValidationError('Each question can appear only once.')
        return answers
