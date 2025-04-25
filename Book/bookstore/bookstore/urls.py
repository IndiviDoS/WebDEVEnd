from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from bookstore_app import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')
router.register(r'orders', views.OrderViewSet, basename='order')

category_urlpatterns = [
    path('', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('<int:pk>/', views.CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.register_user, name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', views.logout_user, name='logout'),
    path('api/categories/', include(category_urlpatterns)),
    path('api/', include(router.urls)),
    path('api/book-detail/<int:id>/', views.book_detail_view, name='book_detail'),
]