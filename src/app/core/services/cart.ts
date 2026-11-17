import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addons: string[];
  unitTotalPrice: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'قيد التحضير' | 'جاري التوصيل' | 'تم التسليم';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  get cartItems() {
    return this.items;
  }
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    // تحميل السلة المحفوظة
    const savedCart = localStorage.getItem('restaurant_cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.cartSubject.next(this.items);
    }

    // تحميل الأوردرات السابقة المحفوظة
    const savedOrders = localStorage.getItem('restaurant_orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      this.ordersSubject.next(this.orders);
    }
  }

  private saveCart() {
    localStorage.setItem('restaurant_cart', JSON.stringify(this.items));
    this.cartSubject.next([...this.items]);
  }

  addToCart(newItem: CartItem) {
    const addonsKey = newItem.addons.sort().join(',');
    const existing = this.items.find(
      item => item.id === newItem.id && item.addons.sort().join(',') === addonsKey
    );

    if (existing) {
      existing.quantity += newItem.quantity;
    } else {
      this.items.push(newItem);
    }
    this.saveCart();
  }

  updateQuantity(index: number, change: number) {
    if (this.items[index]) {
      this.items[index].quantity += change;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
      this.saveCart();
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotalCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + (item.unitTotalPrice * item.quantity), 0);
  }

  // دالة حفظ الأوردر عند تأكيد الشراء
  saveOrder() {
    if (this.items.length === 0) return;

    const subtotal = this.getSubtotal();
    const total = subtotal + 2.00; // رسوم التوصيل

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      items: [...this.items],
      totalAmount: total,
      status: 'قيد التحضير'
    };

    this.orders = [newOrder, ...this.orders];
    localStorage.setItem('restaurant_orders', JSON.stringify(this.orders));
    this.ordersSubject.next([...this.orders]);

    // تفريغ السلة بعد إتمام الطلب
    this.clearCart();
  }
}