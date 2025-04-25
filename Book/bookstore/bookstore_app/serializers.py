# bookstore_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
# >>> Import OrderItem <<<
from .models import UserProfile, Category, Book, Order, OrderItem

# a. Сериализаторы на основе serializers.Serializer
class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )

        UserProfile.objects.create(user=user)
        return user

class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

# b. Сериализаторы на основе serializers.ModelSerializer
class BookSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects, write_only=True)

    class Meta:
        model = Book
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):

    book = BookSerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects, write_only=True, source='book')


    class Meta:
        model = OrderItem

        fields = ['id', 'book', 'quantity', 'book_id']



class OrderSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.username')
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'total_price', 'order_items']

