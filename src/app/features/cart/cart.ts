import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // تم إضافة FormsModule هنا لدعم الـ ngModel في الفورم
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // أضفنا FormsModule للأصناف
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  
  cartService = inject(CartService);
  deliveryFee: number = 2.00;
  orderCompleted: boolean = false;

  // بيانات العميل للتوصيل
  customer = {
    name: '',
    phone: '',
    address: ''
  };


  get cartItems() {
    return this.cartService.cartItems;
  }

  get cartTotal() {
    return this.cartItems.reduce((total: any, item:any)=> total + (item.price * item.quantity),0);
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId); // تأكدي أن دالة removeItem موجودة في الـ CartService عندك
  }
  // دالة إتمام الطلب وتأكيده
  submitOrder(event: Event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    // التأكد من ملء البيانات الأساسية
    if (!this.customer.name || !this.customer.phone || !this.customer.address) {
      alert('يرجى إكمال جميع بيانات التوصيل (الاسم، الهاتف، العنوان)');
      return;
    }

    // حفظ الطلب عبر الخدمة
    this.cartService.saveOrder();
    
    // إظهار شاشة النجاح
    this.orderCompleted = true;

    // تفريغ السلة بعد إتمام الطلب بنجاح (اختياري حسب رغبتك)
    // this.cartService.clearCart();
  }
}