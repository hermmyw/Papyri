# Generated by Django 2.2.7 on 2019-11-30 08:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('papyri', '0003_answer'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='choice',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(3, message='Only 0 to 3')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='answer',
            name='student',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='student', to='papyri.UserInfo'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='answer',
            name='quiz_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quiz', to='papyri.Quiz'),
        ),
    ]
