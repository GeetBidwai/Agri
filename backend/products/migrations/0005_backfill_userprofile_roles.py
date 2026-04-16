from django.conf import settings
from django.db import migrations


def backfill_userprofile_roles(apps, schema_editor):
    User = apps.get_model(*settings.AUTH_USER_MODEL.split("."))
    UserProfile = apps.get_model("products", "UserProfile")
    Product = apps.get_model("products", "Product")
    SellerKYC = apps.get_model("products", "SellerKYC")
    SellerVerification = apps.get_model("products", "SellerVerification")

    seller_user_ids = set(Product.objects.exclude(user__isnull=True).values_list("user_id", flat=True))
    seller_user_ids.update(SellerKYC.objects.values_list("user_id", flat=True))
    seller_user_ids.update(SellerVerification.objects.values_list("user_id", flat=True))
    seller_user_ids.discard(None)

    for user in User.objects.all().iterator():
        profile, _ = UserProfile.objects.get_or_create(
            user_id=user.id,
            defaults={"phone": "", "role": "buyer", "is_verified": False},
        )
        next_role = "seller" if user.id in seller_user_ids or profile.role == "seller" else "buyer"
        if profile.role != next_role:
            profile.role = next_role
            profile.save(update_fields=["role"])


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0004_marketplace_extensions"),
    ]

    operations = [
        migrations.RunPython(backfill_userprofile_roles, migrations.RunPython.noop),
    ]
