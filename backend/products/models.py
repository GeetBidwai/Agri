from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("buyer", "Buyer"),
        ("seller", "Seller"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="buyer")
    is_verified = models.BooleanField(default=False)

    @property
    def is_seller(self):
        return self.role == "seller"

    def __str__(self):
        return f"{self.user.username} profile"


class SellerKYC(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Verified", "Verified"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_kyc_records",
    )
    id_proof = models.FileField(upload_to="kyc/")
    selfie = models.FileField(upload_to="kyc/")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        UserProfile.objects.update_or_create(
            user=self.user,
            defaults={
                "role": "seller",
                "is_verified": self.status == "Verified",
            },
        )

    def __str__(self):
        return f"{self.user.username} KYC ({self.status})"


class SellerVerification(models.Model):
    SELLER_TYPE_CHOICES = [
        ("farmer", "Farmer"),
        ("trader", "Trader"),
        ("wholesaler", "Wholesaler"),
        ("retailer", "Retailer"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_verifications",
    )
    full_name = models.CharField(max_length=150)
    aadhaar_number = models.CharField(max_length=32)
    aadhaar_front_image = models.ImageField(upload_to="verification/")
    aadhaar_back_image = models.ImageField(upload_to="verification/")
    selfie_image = models.ImageField(upload_to="verification/", null=True, blank=True)
    address = models.TextField()
    seller_type = models.CharField(max_length=20, choices=SELLER_TYPE_CHOICES)
    verification_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        UserProfile.objects.update_or_create(
            user=self.user,
            defaults={
                "phone": getattr(getattr(self.user, "profile", None), "phone", ""),
                "role": "seller",
                "is_verified": self.is_verified or self.verification_status == "approved",
            },
        )

    def __str__(self):
        return f"{self.user.username} verification ({self.verification_status})"


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Grains', 'Grains'),
        ('Pulses', 'Pulses'),
        ('Spices', 'Spices'),
        ('Oilseeds', 'Oilseeds'),
        ('Vegetables', 'Vegetables'),
        ('Fruits', 'Fruits'),
        ('Cotton', 'Cotton'),
        ('Sugar', 'Sugar'),
    ]

    LISTING_TYPE_CHOICES = [
        ('SELL', 'Sell'),
        ('BUY', 'Buy'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="products",
    )

    listing_type = models.CharField(
        max_length=10,
        choices=LISTING_TYPE_CHOICES,
        default='SELL',
    )

    name = models.CharField(max_length=100)
    product_name = models.CharField(max_length=100, blank=True, default="")
    hindi = models.CharField(max_length=100, blank=True)
    hindi_name = models.CharField(max_length=100, blank=True, default="")
    variety = models.CharField(max_length=100, blank=True)

    quantity = models.IntegerField()  # changed to numeric

    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=20,
        choices=[
            ("active", "Active"),
            ("sold", "Sold"),
            ("expired", "Expired"),
        ],
        default="active",
    )

    location = models.CharField(max_length=100)
    seller = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20, blank=True, default="")

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        blank=True,
        null=True,
    )

    image = models.ImageField(upload_to='listings/', null=True, blank=True)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.listing_type})"


class ListingReport(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reports",
    )
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    reason = models.TextField(default="Suspicious listing")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("product", "reporter")

    def __str__(self):
        return f"Report for {self.product_id} by {self.reporter_id}"


class Bid(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="bids",
    )
    buyer_name = models.CharField(max_length=100)
    buyer_phone = models.CharField(max_length=20)
    bid_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()  # changed to numeric
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.buyer_name} - {self.product.name}"
