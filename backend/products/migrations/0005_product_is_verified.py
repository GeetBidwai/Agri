from django.db import migrations, models


def copy_verified_to_is_verified(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    Product.objects.filter(verified=True).update(is_verified=True)


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0004_userprofile"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(copy_verified_to_is_verified, migrations.RunPython.noop),
    ]
