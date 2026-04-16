from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0003_sellerverification"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="description",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="product",
            name="status",
            field=models.CharField(choices=[("active", "Active"), ("sold", "Sold"), ("expired", "Expired")], default="active", max_length=20),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="role",
            field=models.CharField(choices=[("buyer", "Buyer"), ("seller", "Seller")], default="buyer", max_length=20),
        ),
        migrations.CreateModel(
            name="SellerKYC",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("id_proof", models.FileField(upload_to="kyc/")),
                ("selfie", models.FileField(upload_to="kyc/")),
                ("status", models.CharField(choices=[("Pending", "Pending"), ("Verified", "Verified"), ("Rejected", "Rejected")], default="Pending", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="seller_kyc_records", to="auth.user")),
            ],
        ),
    ]
