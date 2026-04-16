from django.contrib import admin
from .models import Product, SellerKYC, SellerVerification, UserProfile


class SellerKYCAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status')  # adjust field names if needed
    list_filter = ('status',)
    search_fields = ('user__username',)


class SellerVerificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'verification_status', 'is_verified', 'created_at')
    list_filter = ('verification_status',)
    search_fields = ('user__username',)

admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(SellerKYC, SellerKYCAdmin)
admin.site.register(SellerVerification, SellerVerificationAdmin)