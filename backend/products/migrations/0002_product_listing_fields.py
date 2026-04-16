from django.db import migrations, models


def sync_listing_aliases(apps, schema_editor):
    Product = apps.get_model("products", "Product")

    for product in Product.objects.all():
        changed_fields = []

        if not product.product_name:
            product.product_name = product.name
            changed_fields.append("product_name")

        if not product.hindi_name and product.hindi:
            product.hindi_name = product.hindi
            changed_fields.append("hindi_name")

        if changed_fields:
            product.save(update_fields=changed_fields)


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="contact_phone",
            field=models.CharField(blank=True, default="", max_length=20),
        ),
        migrations.AddField(
            model_name="product",
            name="hindi_name",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="product",
            name="product_name",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(blank=True, choices=[("Grains", "Grains"), ("Pulses", "Pulses"), ("Spices", "Spices"), ("Oilseeds", "Oilseeds"), ("Vegetables", "Vegetables"), ("Fruits", "Fruits"), ("Cotton", "Cotton"), ("Sugar", "Sugar")], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="listings/"),
        ),
        migrations.RunPython(sync_listing_aliases, migrations.RunPython.noop),
    ]
