from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET', 'POST'])
def get_products(request):
    
    # GET → fetch data
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        products = Product.objects.all().order_by('-created_at')

        # Optional search keeps the old response unchanged when query is empty
        if search_query:
            products = products.filter(name__icontains=search_query)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    # POST → create new product
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
