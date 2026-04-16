from rest_framework import serializers
from .models import Product, Bid, SellerVerification


class ProductSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    product_name = serializers.CharField(required=False, allow_blank=True)
    hindi_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'user',
            'username',
            'listing_type',
            'name',
            'product_name',
            'hindi',
            'hindi_name',
            'variety',
            'quantity',
            'price_per_kg',
            'location',
            'seller',
            'contact_phone',
            'category',
            'image',
            'is_verified',
            'created_at',
        ]
        read_only_fields = [
            'user',
            'username',
            'seller',
            'contact_phone',
            'is_verified',
            'created_at',
        ]

    def _sync_legacy_fields(self, validated_data):
        product_name = validated_data.pop("product_name", None)
        hindi_name = validated_data.pop("hindi_name", None)

        if product_name is not None:
            validated_data["product_name"] = product_name
            validated_data["name"] = product_name
        elif "name" in validated_data:
            validated_data["product_name"] = validated_data["name"]

        if hindi_name is not None:
            validated_data["hindi_name"] = hindi_name
            validated_data["hindi"] = hindi_name
        elif "hindi" in validated_data:
            validated_data["hindi_name"] = validated_data["hindi"]

        return validated_data

    def create(self, validated_data):
        return super().create(self._sync_legacy_fields(validated_data))

    def update(self, instance, validated_data):
        return super().update(instance, self._sync_legacy_fields(validated_data))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["product_name"] = instance.product_name or instance.name
        data["hindi_name"] = instance.hindi_name or instance.hindi
        data["contact_phone"] = instance.contact_phone or getattr(getattr(instance.user, "profile", None), "phone", "")
        if instance.image:
            request = self.context.get("request")
            data["image"] = request.build_absolute_uri(instance.image.url) if request else instance.image.url
        return data


class ProductContactSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    phone = serializers.SerializerMethodField()

    def get_phone(self, obj):
        if obj.contact_phone:
            return obj.contact_phone
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
        fields = [
            'id',
            'buyer_name',
            'buyer_phone',
            'bid_price',
            'quantity',
            'created_at'
        ]
        read_only_fields = ['created_at']


class SellerVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerVerification
        fields = [
            "id",
            "user",
            "full_name",
            "aadhaar_number",
            "aadhaar_front_image",
            "aadhaar_back_image",
            "selfie_image",
            "address",
            "seller_type",
            "verification_status",
            "is_verified",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "verification_status",
            "is_verified",
            "created_at",
        ]
