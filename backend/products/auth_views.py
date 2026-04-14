from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, UserProfile


User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")
    phone = request.data.get("phone", "").strip()

    if not username or not password or not phone:
        return Response(
            {"detail": "Username, password, and phone are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user, phone=phone)
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "phone": phone,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {"detail": "Invalid username or password."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)
    profile, _ = UserProfile.objects.get_or_create(user=user)

    return Response(
        {
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "phone": profile.phone,
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "phone": profile.phone,
            "listing_count": Product.objects.filter(user=request.user).count(),
        }
    )
