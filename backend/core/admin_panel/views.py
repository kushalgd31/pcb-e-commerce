from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView
from products.models import Product
from orders.models import Order

class AdminLoginView(LoginView):
    template_name = 'admin_panel/login.html'
    redirect_authenticated_user = True
    success_url = reverse_lazy('admin_dashboard')

@login_required
@user_passes_test(lambda u: u.is_staff or u.role == 'admin')
def dashboard(request):
    return render(request, 'admin_panel/dashboard.html')

class ProductListView(ListView):
    model = Product
    template_name = 'admin_panel/products.html'
    context_object_name = 'products'

class ProductCreateView(CreateView):
    model = Product
    template_name = 'admin_panel/product_form.html'
    fields = ['name', 'description', 'price', 'stock']
    success_url = reverse_lazy('admin_products')

class ProductUpdateView(UpdateView):
    model = Product
    template_name = 'admin_panel/product_form.html'
    fields = ['name', 'description', 'price', 'stock']
    success_url = reverse_lazy('admin_products')

class OrderListView(ListView):
    model = Order
    template_name = 'admin_panel/orders.html'
    context_object_name = 'orders'

@login_required
@user_passes_test(lambda u: u.is_staff or u.role == 'admin')
def update_order_status(request, pk):
    order = get_object_or_404(Order, pk=pk)
    if request.method == 'POST':
        status = request.POST.get('status')
        if status in ['approved', 'rejected']:
            order.status = status
            order.save()
            messages.success(request, f'Order {status}.')
        return redirect('admin_orders')
    return render(request, 'admin_panel/order_detail.html', {'order': order})
