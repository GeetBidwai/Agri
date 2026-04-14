from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'type',
            'user',
            'username',
            'listing_type',
            'name',
            'hindi',
            'variety',
            'quantity',
            'price_per_kg',
            'location',
            'seller',
            'verified',
            'is_verified',
            'created_at',
        ]


class ProductContactSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    phone = serializers.SerializerMethodField()

    def get_phone(self, obj):
        profile = getattr(obj.user, "profile", None)
        return getattr(profile, "phone", "")

    class Meta:
        model = Product
        fields = [
            "id",
            "username",
            "phone",
            "listing_type",
        ]
