from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Product, UserProfile, Bid
from .serializers import ProductSerializer, ProductContactSerializer, BidSerializer


def perform_create(serializer, request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    phone = profile.phone

    product_name = serializer.validated_data.get("product_name") or serializer.validated_data.get("name", "")
    hindi_name = serializer.validated_data.get("hindi_name") or serializer.validated_data.get("hindi", "")

    serializer.save(
        user=request.user,
        seller=request.user.username,
        contact_phone=phone,
        product_name=product_name,
        name=product_name,
        hindi_name=hindi_name,
        hindi=hindi_name,
    )


@api_view(['GET', 'POST'])
def get_products(request):
    # GET -> fetch data
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        listing_type = request.GET.get('type', '').strip().upper()
        category_query = request.GET.get('category', '').strip()
        products = Product.objects.all().order_by('-created_at')

        # Optional search keeps the old response unchanged when query is empty
        if search_query:
            products = products.filter(name__icontains=search_query)

        # Optional type filter keeps the old response unchanged when no filter is sent
        if listing_type in {'BUY', 'SELL'}:
            products = products.filter(listing_type=listing_type)

        # Optional category filter
        if category_query:
            products = products.filter(category__iexact=category_query)

        serializer = ProductSerializer(products, many=True, context={"request": request})
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

        # Keep old and new fields in sync so existing UI logic continues to work
        if listing_type:
            payload['listing_type'] = str(listing_type).upper()
            payload['type'] = str(listing_type).lower()
        elif payload.get('type'):
            payload['listing_type'] = str(payload['type']).upper()

        if payload.get('product_name') and not payload.get('name'):
            payload['name'] = payload['product_name']
        elif payload.get('name') and not payload.get('product_name'):
            payload['product_name'] = payload['name']

        if payload.get('hindi_name') and not payload.get('hindi'):
            payload['hindi'] = payload['hindi_name']
        elif payload.get('hindi') and not payload.get('hindi_name'):
            payload['hindi_name'] = payload['hindi']

        payload.pop('seller', None)
        payload.pop('phone', None)
        payload.pop('contact_phone', None)

        serializer = ProductSerializer(data=payload, context={"request": request})
        if serializer.is_valid():
            perform_create(serializer, request)
            return Response(
                ProductSerializer(serializer.instance, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_product_contact(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    serializer = ProductContactSerializer(product)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def manage_bids(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == 'GET':
        bids = product.bids.all().order_by('-created_at')
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        payload = request.data.copy()
        payload['product'] = product.id
        serializer = BidSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
