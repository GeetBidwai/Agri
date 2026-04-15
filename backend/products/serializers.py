from rest_framework import serializers
from .models import Product, Bid


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
            'image',
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


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['id', 'buyer_name', 'buyer_phone', 'bid_price', 'quantity', 'created_at']
        read_only_fields = ['created_at']
