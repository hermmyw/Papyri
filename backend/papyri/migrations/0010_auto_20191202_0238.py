# Generated by Django 2.2.7 on 2019-12-02 02:38

from django.db import migrations, models
import papyri.models


class Migration(migrations.Migration):

    dependencies = [
        ('papyri', '0009_auto_20191202_0232'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profilepic',
            name='pic1',
            field=models.ImageField(blank=True, upload_to='profile_pics'),
        ),
        migrations.AlterField(
            model_name='profilepic',
            name='pic2',
            field=models.ImageField(blank=True, upload_to=papyri.models.upload_path_handler),
        ),
    ]
