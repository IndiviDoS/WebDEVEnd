# bookstore_app/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import Category, Book, Order, OrderItem
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core import serializers as django_serializers # Renamed to avoid conflict with rest_framework.serializers

# Optional: Import filters if using filterset_fields on ViewSets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter


from .serializers import (
    UserRegistrationSerializer,
    CategorySerializer,
    BookSerializer,
    OrderSerializer,
    OrderItemSerializer, 
)

# --- Function Based Views (FBV) ---
@api_view(['GET'])
def book_detail_view(request, id):
    book = get_object_or_404(Book, pk=id)
    serializer = BookSerializer(book) # Use BookSerializer
    return Response(serializer.data)


@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist() 
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"detail": "Invalid token or other error."}, status=status.HTTP_400_BAD_REQUEST)


# --- Class Based Views (CBV) ---

# Using generics for simpler List/Create and Retrieve/Update/Destroy
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [IsAuthenticated] # Add permissions if needed for creation


class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [IsAuthenticated] # Add permissions if needed


# Using ViewSet for Book CRUD
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # Optional: Add filters if you want /api/books/?category=1 etc.
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'id'] # Allow filtering by category or ID
    search_fields = ['title', 'author', 'description'] # Allow searching title/author/description
    ordering_fields = ['title', 'author', 'price'] # Allow ordering by title/author/price
    # permission_classes = [IsAuthenticated] # Add permissions if needed for create/update/delete


# Using ViewSet for Order operations (List, Create, Retrieve, etc.)
class OrderViewSet(viewsets.ModelViewSet):
    # Use the updated OrderSerializer that includes order_items
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated] # Orders can only be viewed/created by authenticated users

    def get_queryset(self):
        """
        Returns orders for the current authenticated user.
        Uses prefetch_related to efficiently fetch the related OrderItem instances
        and their associated Book details in a single query per relation.
        """
        user = self.request.user
        if user.is_authenticated:
            # >>> Updated queryset <<<
            # Filter by the current user and prefetch order_items and the book linked via each order_item
            # 'order_items' comes from the related_name in the OrderItem model
            return Order.objects.filter(user=user).prefetch_related('order_items__book')
        return Order.objects.none() # Return an empty queryset if the user is not authenticated


    # We override the create method to manually handle Order and OrderItem creation
    # based on the 'items' list sent from the frontend.
    # The default create method calls serializer.is_valid() and perform_create.
    # We keep the serializer.is_valid() check but handle the saving ourselves in perform_create.
    def create(self, request, *args, **kwargs):
        # Use the serializer to validate the incoming data structure (though it's minimal now)
        # This also ensures authentication checks etc. are done.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Validate data, raise exception on failure

        # Call our custom perform_create logic which handles Order and OrderItem creation
        # perform_create should return the created Order instance
        order_instance = self.perform_create(serializer)

        # Serialize the created order instance for the response using the same serializer
        response_serializer = self.get_serializer(order_instance)

        # Get success headers (like Location)
        headers = self.get_success_headers(response_serializer.data)

        # Return the response with the serialized order data and 201 status
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_create(self, serializer):
        """
        Handles creating the Order instance and the related OrderItem instances
        from the 'items' list in the request data.
        """
        # Get the list of items from the request data payload sent by the frontend
        book_items_data = self.request.data.get('items', [])

        # >>> Validation: Check if items list is provided and not empty <<<
        if not book_items_data or not isinstance(book_items_data, list):
            # If no items or items is not a list, raise a validation error
            raise serializers.ValidationError({"items": "No items provided or items is not a list."})

        # >>> Create the base Order instance first <<<
        # We create the Order instance manually here to get the order object needed
        # to link the OrderItem instances to it.
        # Assign the currently authenticated user to the order.
        order = Order.objects.create(user=self.request.user)

        total_price = 0 # Initialize total price calculation
        order_items_to_create = [] # List to collect OrderItem instances before bulk creation

        # >>> Process each item dictionary from the frontend payload <<<
        for item_data in book_items_data:
            # Validate structure of each item dictionary
            if not isinstance(item_data, dict):
                 print(f"Skipping invalid item data (not a dictionary): {item_data}")
                 continue # Skip items that are not dictionaries

            book_id = item_data.get('book_id')
            quantity = item_data.get('quantity', 1) # Default quantity to 1 if not provided

            # >>> Validation for each item's content <<<
            # Check if book_id is provided, quantity is a positive integer
            if book_id is None or not isinstance(quantity, int) or quantity <= 0:
                print(f"Skipping invalid item data (missing book_id or invalid quantity): {item_data}")
                continue # Skip this item if invalid data

            try:
                # >>> Get the Book instance <<<
                # Fetch the book object based on the provided book_id
                book = Book.objects.get(pk=book_id)

                # >>> Create an OrderItem instance (in memory) <<<
                # Create the OrderItem object but do NOT save it to the database yet.
                # Link it to the 'order' instance created above and the 'book' instance.
                order_item = OrderItem(
                    order=order,
                    book=book,
                    quantity=quantity
                )
                order_items_to_create.append(order_item) # Add the item to our list for bulk creation

                # >>> Calculate total price <<<
                # Add the price of this item (book price * quantity) to the order's total
                total_price += book.price * quantity

            except Book.DoesNotExist:
                # >>> Handle Case: Book ID does not exist <<<
                # If a book ID from the payload doesn't match a book in the database,
                # clean up the Order instance we created and raise a validation error.
                print(f"Book with ID {book_id} does not exist. Cleaning up order {order.id}.")
                order.delete() # Delete the order instance
                raise serializers.ValidationError(f"Book with ID {book_id} does not exist.")
            except Exception as e:
                 # >>> Handle other potential errors during item processing <<<
                 print(f"Error processing item {item_data}: {e}. Cleaning up order {order.id}.")
                 order.delete() # Delete the order instance
                 raise serializers.ValidationError(f"Error processing item: {e}")


        # >>> Bulk Create OrderItem instances <<<
        # After looping through all items, efficiently save all the collected OrderItem instances to the database
        if order_items_to_create:
             OrderItem.objects.bulk_create(order_items_to_create)
        else:
             # >>> Handle Case: No valid order items created <<<
             # If the frontend payload had items, but none were valid (e.g., all had invalid book_ids),
             # the order_items_to_create list will be empty. In this case, delete the empty order
             # instance that was created and raise a validation error.
             print(f"No valid order items created. Cleaning up empty order {order.id}.")
             order.delete()
             raise serializers.ValidationError({"items": "No valid items provided to create order."})


        # >>> Update the Order's total price and save <<<
        # Assign the calculated total price to the order instance and save it.
        order.total_price = total_price
        order.save()

        # >>> Return the created Order instance <<<
        # The create method expects perform_create to return the instance that was created.
        return order

    # Keep the update method if you need to support updating orders,
    # but you'll need to implement logic to handle updating OrderItem instances.
    # def update(self, instance, validated_data):
    #    # ... update logic ...
    #    pass