from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0009_productimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="bid",
            name="status",
            field=models.CharField(
                choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
                default="pending",
                max_length=20,
            ),
        ),
    ]
