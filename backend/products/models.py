from django.db import models

class Product(models.Model):
    TYPE_CHOICES = [
        ('sell', 'Sell'),
        ('buy', 'Buy'),
    ]

    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    name = models.CharField(max_length=100)
    hindi = models.CharField(max_length=100)
    variety = models.CharField(max_length=100)
    quantity = models.CharField(max_length=50)
    price_per_kg = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    seller = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name