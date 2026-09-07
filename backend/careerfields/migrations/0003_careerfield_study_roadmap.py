from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('careerfields', '0002_careerfield_insights'),
    ]

    operations = [
        migrations.AddField(
            model_name='careerfield',
            name='study_roadmap',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
