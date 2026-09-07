from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('universities', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='university',
            name='about',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='university',
            name='known_for',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='university',
            name='best_for',
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
