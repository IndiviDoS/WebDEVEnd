# bookstore_app/admin.py
from django.contrib import admin
from .models import Order, OrderItem, Book, Category, UserProfile # Import all models you need

# Optional: Customize User admin (keep if you were using it)
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
try: admin.site.unregister(User)
except admin.sites.NotRegistered: pass
admin.site.register(User, CustomUserAdmin)
admin.site.register(UserProfile) # Register UserProfile directly if not using inline

# Optional: Register other models if you haven't already
admin.site.register(Book)
admin.site.register(Category)


# >>> Simplified Inline class for OrderItem <<<
class OrderItemInline(admin.TabularInline):
    model = OrderItem # This inline is for the OrderItem model
    extra = 0 # Don't show extra blank forms for adding items
    can_delete = False # Prevent deleting order items from the order view
    # We will display a custom read-only field for book info and the quantity
    fields = ['book_details', 'quantity']
    readonly_fields = ['book_details', 'quantity'] # Make both fields read-only

    # Method to display book information as a formatted string
    # 'instance' here refers to the OrderItem object
    def book_details(self, instance):
        if instance.book: # Check if the book relationship is valid
             return f"{instance.book.title} by {instance.book.author} (${instance.book.price})"
        return "N/A" # Display N/A if book is missing
    # Set a user-friendly column header for this method
    book_details.short_description = 'Book'


# >>> Custom ModelAdmin for the Order model (mostly same as before) <<<
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_date', 'total_price')
    list_filter = ('order_date', 'user')
    search_fields = ('user__username',)
    # Specify that the OrderItemInline should be included in the Order detail view
    inlines = [OrderItemInline]

    # Optional: Make Order fields read-only if you don't want to edit the order itself
    readonly_fields = ('user', 'order_date', 'total_price')


# >>> Register the Order model with our custom OrderAdmin <<<
# Unregister default registration if it exists
try:
    admin.site.unregister(Order)
except admin.sites.NotRegistered:
    pass

# Register the Order model with the custom admin class
admin.site.register(Order, OrderAdmin)