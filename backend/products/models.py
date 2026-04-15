from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username} profile"


class Product(models.Model):
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
    hindi = models.CharField(max_length=100, blank=True)
    variety = models.CharField(max_length=100, blank=True)

    quantity = models.IntegerField()  # changed to numeric

    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)

    location = models.CharField(max_length=100)
    seller = models.CharField(max_length=100)

    category = models.CharField(max_length=50, blank=True, null=True)

    image = models.ImageField(upload_to='products/', null=True, blank=True)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.listing_type})"


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