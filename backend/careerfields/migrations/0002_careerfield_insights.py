from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('careerfields', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='careerfield',
            name='market_outlook',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='careerfield',
            name='future_outlook',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='careerfield',
            name='field_value',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='careerfield',
            name='job_types',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='careerfield',
            name='opportunities',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='careerfield',
            name='risks',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
