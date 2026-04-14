from django.db import migrations, models


def populate_listing_type(apps, schema_editor):
    Product = apps.get_model("products", "Product")

    for product in Product.objects.all():
        product.listing_type = "BUY" if product.type == "buy" else "SELL"
        product.save(update_fields=["listing_type"])


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="listing_type",
            field=models.CharField(
                choices=[("SELL", "Sell"), ("BUY", "Buy")],
                default="SELL",
                max_length=10,
            ),
        ),
        migrations.RunPython(populate_listing_type, migrations.RunPython.noop),
    ]
