from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('dashboard/', views.dashboard, name='admin_dashboard'),
    path('products/', views.ProductListView.as_view(), name='admin_products'),
    path('products/add/', views.ProductCreateView.as_view(), name='admin_product_add'),
    path('products/<int:pk>/edit/', views.ProductUpdateView.as_view(), name='admin_product_edit'),
    path('orders/', views.OrderListView.as_view(), name='admin_orders'),
    path('orders/<int:pk>/update/', views.update_order_status, name='admin_order_update'),
]