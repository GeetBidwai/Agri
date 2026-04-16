from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_product_listing_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="SellerVerification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=150)),
                ("aadhaar_number", models.CharField(max_length=32)),
                ("aadhaar_front_image", models.ImageField(upload_to="verification/")),
                ("aadhaar_back_image", models.ImageField(upload_to="verification/")),
                ("selfie_image", models.ImageField(blank=True, null=True, upload_to="verification/")),
                ("address", models.TextField()),
                ("seller_type", models.CharField(choices=[("farmer", "Farmer"), ("trader", "Trader"), ("wholesaler", "Wholesaler"), ("retailer", "Retailer")], max_length=20)),
                ("verification_status", models.CharField(choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")], default="pending", max_length=20)),
                ("is_verified", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="seller_verifications", to="auth.user")),
            ],
        ),
    ]
