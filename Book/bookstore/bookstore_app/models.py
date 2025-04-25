# bookstore_app/models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    # Дополнительные поля профиля

    def __str__(self):
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class OrderItem(models.Model):
    # ForeignKey to Order. related_name='order_items' allows accessing
    # OrderItem instances from an Order instance like order.order_items.all()
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='order_items')
    # ForeignKey to Book.
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    # Field to store the quantity of this book in this order item
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        # Provides a human-readable representation
        return f"{self.quantity} x {self.book.title} in Order #{self.order.id}"

    class Meta:
        # Constraint to ensure the same book is not added multiple times
        # within the same order via separate OrderItem instances
        unique_together = ('order', 'book')


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Use a ManyToManyField through the OrderItem model.
    # The 'items' name here will represent the collection of Books linked via OrderItem,
    # but we primarily interact via the OrderItem objects themselves (using related_name 'order_items').
    items = models.ManyToManyField(Book, through='OrderItem')


    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"