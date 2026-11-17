import { Component, inject , signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  cartService = inject(CartService);
  router = inject(Router);

  // بيانات الأطباق المميزة في الهوم
  featuredDishes = [
    {
      id: '1',
      name: 'شاورما دجاج مميزة',
      price: 3.00,
      image: 'https://png.pngtree.com/background/20250103/original/pngtree-arabic-chicken-shawarma-generate-ai-picture-image_15514444.jpg',
      description: 'تقدم مع الثومية والبطاطس الطازجة والخبز الساخن.'
    },
    {
      id: '2',
      name: 'كريب مشكل فاخر',
      price: 11.00,
      image: 'https://www.albawaba.com/sites/default/files/im_new/lojain.naser/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D8%A8%20%D8%A8%D8%A7%D9%84%D9%81%D8%B1%D8%A7%D8%AE.jpg',
      description: 'تشكيلة مقرمشة من الكريب المحشية والمقرمشة على أصولها.'
    },
    {
      id: '3',
      name: 'بقلاوة بالفستق',
      price: 5.00,
      image: 'https://tse1.mm.bing.net/th/id/OIP.Q-11x2oCSLYjDGMYWRT5_wHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'حلوى شرقية مقرمشة محشوة بأجود أنواع الفستق الحلبي.'
    }
  ];

  selectedDish: any = null;

  // دالة فتح نافذة التفاصيل (Modal)
  openDetails(dish: any) {
    this.selectedDish = dish;
  }

  closeDetails() {
    this.selectedDish = null;
  }

  // دالة الإضافة للسلة
 toastMessage = signal<string | null>(null);
  private toastTimeout: any;

 addToCart(dish: any, goToCart: boolean = false) {
    this.cartService.addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: 1,
      addons: [],
      unitTotalPrice: dish.price
    });

 if (goToCart) {
      this.router.navigate(['/cart']);
    } else {
      // 3. تحديث قيمة الـ signal
      this.toastMessage.set(`تم إضافة "${dish.name}" إلى السلة بنجاح!`);
      
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.toastTimeout = setTimeout(() => {
        this.toastMessage.set(null); // هتختفي فوراً بعد 3 ثواني بالظبط
      }, 3000);
    }
  }
}