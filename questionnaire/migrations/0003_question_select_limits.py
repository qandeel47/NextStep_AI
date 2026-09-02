from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaire', '0002_questionnairesubmission_useranswer'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='min_select',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='question',
            name='max_select',
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
