import os
import shutil

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Product, UserProfile


TEST_MEDIA_ROOT = os.path.join(os.path.dirname(__file__), "test_media")


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class Phase3BackendTests(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user_model = get_user_model()

    def test_signup_ignores_role_input_and_keeps_transition_role_response(self):
        response = self.client.post(
            "/api/auth/signup/",
            {
                "username": "phase3signup",
                "password": "testpass123",
                "phone": "9999999999",
                "role": "seller",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("role", response.data["user"])

        profile = UserProfile.objects.get(user__username="phase3signup")
        self.assertFalse(profile.is_verified)

    def test_verified_user_can_create_listing_even_without_seller_role(self):
        user = self.user_model.objects.create_user(username="verifiedbuyer", password="testpass123")
        UserProfile.objects.create(
            user=user,
            phone="8888888888",
            is_verified=True,
            kyc_status="verified",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/listings/create/",
            {
                "product_name": "Wheat",
                "category": "Grains",
                "listing_type": "SELL",
                "quantity": 10,
                "price_per_kg": "25.50",
                "location": "Indore",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
        product = Product.objects.get()
        self.assertEqual(product.user, user)
        self.assertEqual(product.seller, user.username)

    def test_unverified_user_can_check_kyc_status(self):
        user = self.user_model.objects.create_user(username="kycstatus", password="testpass123")
        UserProfile.objects.create(user=user, phone="7777777777", is_verified=False)
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/kyc/status/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["submitted"], False)
        self.assertEqual(response.data["status"], "Not Submitted")

    def test_kyc_upload_does_not_promote_role_to_seller(self):
        user = self.user_model.objects.create_user(username="kycupload", password="testpass123")
        profile = UserProfile.objects.create(user=user, phone="6666666666", is_verified=False)
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/kyc/upload/",
            {
                "id_proof": SimpleUploadedFile("id-proof.txt", b"id-proof", content_type="text/plain"),
                "selfie": SimpleUploadedFile("selfie.txt", b"selfie", content_type="text/plain"),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        profile.refresh_from_db()
        self.assertEqual(profile.kyc_status, "pending")
        self.assertFalse(profile.is_verified)

    def test_owner_can_update_product_from_products_detail_endpoint(self):
        user = self.user_model.objects.create_user(username="editor", password="testpass123")
        product = Product.objects.create(
            user=user,
            seller=user.username,
            contact_phone="5555555555",
            listing_type="SELL",
            name="Chili",
            product_name="Chili",
            quantity=10,
            price_per_kg="180.00",
            location="Indore",
            category="Spices",
        )
        self.client.force_authenticate(user=user)

        response = self.client.put(
            f"/api/products/{product.id}/",
            {
                "product_name": "Red Chili",
                "price_per_kg": "190.00",
                "quantity": 12,
                "location": "Dewas",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.name, "Red Chili")
        self.assertEqual(product.product_name, "Red Chili")
        self.assertEqual(str(product.price_per_kg), "190.00")
        self.assertEqual(product.quantity, 12)
        self.assertEqual(product.location, "Dewas")

    def test_non_owner_cannot_delete_product_from_products_detail_endpoint(self):
        owner = self.user_model.objects.create_user(username="owner", password="testpass123")
        intruder = self.user_model.objects.create_user(username="intruder", password="testpass123")
        product = Product.objects.create(
            user=owner,
            seller=owner.username,
            contact_phone="5555555555",
            listing_type="SELL",
            name="Turmeric",
            product_name="Turmeric",
            quantity=8,
            price_per_kg="120.00",
            location="Ujjain",
            category="Spices",
        )
        self.client.force_authenticate(user=intruder)

        response = self.client.delete(f"/api/products/{product.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Product.objects.filter(id=product.id).exists())
