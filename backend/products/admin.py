from django.contrib import admin
from .models import Product, SellerKYC, SellerVerification, UserProfile

admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(SellerKYC)
admin.site.register(SellerVerification)
