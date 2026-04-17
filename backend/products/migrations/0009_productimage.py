from django.db import migrations, models


def copy_existing_product_images(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductImage = apps.get_model("products", "ProductImage")

    product_images = []
    for product in Product.objects.exclude(image="").exclude(image__isnull=True):
        product_images.append(
            ProductImage(product_id=product.id, image=product.image.name)
        )

    if product_images:
        ProductImage.objects.bulk_create(product_images, ignore_conflicts=True)


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0008_remove_userprofile_role"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="listings/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("product", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="images", to="products.product")),
            ],
            options={
                "ordering": ["created_at", "id"],
            },
        ),
        migrations.RunPython(copy_existing_product_images, migrations.RunPython.noop),
    ]
