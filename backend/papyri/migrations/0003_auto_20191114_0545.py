# Generated by Django 2.2.7 on 2019-11-14 05:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('papyri', '0002_auto_20191114_0525'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='uid',
            field=models.CharField(max_length=10, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9]{9}')]),
        ),
    ]
