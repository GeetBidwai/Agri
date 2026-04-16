from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SellerVerification
from .serializers import SellerVerificationSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_seller(request):
    existing = SellerVerification.objects.filter(user=request.user).order_by("-created_at").first()
    serializer = SellerVerification(data=request.data, context={"request": request})

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if existing and existing.verification_status == "pending":
        return Response(
            {"detail": "Verification is already pending."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    verification = serializer.save(
        user=request.user,
        verification_status="pending",
        is_verified=False,
    )

    return Response(
        SellerVerificationSerializer(verification, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verification_status(request):
    verification = SellerVerification.objects.filter(user=request.user).order_by("-created_at").first()

    if not verification:
        return Response(
            {
                "submitted": False,
                "verification_status": "not_submitted",
                "is_verified": False,
            }
        )

    data = SellerVerificationSerializer(verification, context={"request": request}).data
    data["submitted"] = True
    return Response(data)
