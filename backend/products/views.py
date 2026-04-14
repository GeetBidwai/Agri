from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Product, UserProfile
from .serializers import ProductSerializer, ProductContactSerializer


@api_view(['GET', 'POST'])
def get_products(request):
    # GET -> fetch data
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        listing_type = request.GET.get('type', '').strip().upper()
        products = Product.objects.all().order_by('-created_at')

        # Optional search keeps the old response unchanged when query is empty
        if search_query:
            products = products.filter(name__icontains=search_query)

        # Optional type filter keeps the old response unchanged when no filter is sent
        if listing_type in {'BUY', 'SELL'}:
            products = products.filter(listing_type=listing_type)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    # POST -> create new product
    if request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        payload = request.data.copy()
        listing_type = payload.get('listing_type')
        phone = str(payload.get('phone', '')).strip()

        # Keep old and new fields in sync so existing UI logic continues to work
        if listing_type:
            payload['listing_type'] = str(listing_type).upper()
            payload['type'] = str(listing_type).lower()
        elif payload.get('type'):
            payload['listing_type'] = str(payload['type']).upper()

        # Save contact phone on the user's profile so View Contact can show it later
        if phone:
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            profile.phone = phone
            profile.save(update_fields=['phone'])

        payload.pop('phone', None)
        payload['user'] = request.user.id
        serializer = ProductSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


@api_view(["GET"])
def get_product_contact(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    serializer = ProductContactSerializer(product)
    return Response(serializer.data)
