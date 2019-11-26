# Generated by Django 2.2.7 on 2019-11-26 04:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('papyri', '0014_auto_20191124_1124'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lecture',
            old_name='class_id',
            new_name='c',
        ),
        migrations.RenameField(
            model_name='lectureattendance',
            old_name='lecture_id',
            new_name='lecture',
        ),
        migrations.RenameField(
            model_name='lectureattendance',
            old_name='student_id',
            new_name='student',
        ),
        migrations.RemoveField(
            model_name='lectureattendance',
            name='class_id',
        ),
        migrations.AddField(
            model_name='classinfo',
            name='registration_code',
            field=models.CharField(default=0, max_length=5, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='classinfo',
            name='term',
            field=models.CharField(default=0, max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='classinfo',
            name='year',
            field=models.CharField(default=2019, max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='lecture',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='in_session',
            field=models.BooleanField(default=True),
        ),
    ]
