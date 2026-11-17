import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

interface Dish {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {
  cartService = inject(CartService);
  router = inject(Router);

  selectedCategory = signal<string>('all');
  currentPage = signal<number>(1);
  itemsPerPage = 6;

  // إشعار الإضافة للسلة (Toast)
  toastMessage = signal<string | null>(null);
  private toastTimeout: any;

  dishes: Dish[] = [
    // --- الأطباق الرئيسية (Mains) ---
    {
      id: 1,
      name: 'شاورما دجاج مميزة',
      category: 'mains',
      price: 3.00,
      description: 'تقدم مع الثومية والبطاطس الطازجة والخبز الساخن.',
      image: 'https://png.pngtree.com/background/20250103/original/pngtree-arabic-chicken-shawarma-generate-ai-picture-image_15514444.jpg',
      badge: 'الأكثر طلباً'
    },
    {
      id: 4,
      name: 'مشاوي مشكلة ملكية',
      category: 'mains',
      price: 15.00,
      description: 'سيخ كباب، تكا، وشيش طاووق يقدم مع الأرز البسمتي.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 7,
      name: 'مندي لحم على الطريقة التقليدية',
      category: 'mains',
      price: 18.50,
      description: 'قطع لحم طرية مطبوخة ببطء مع الأرز البهارات الخليجية الأصيلة.',
      image: 'https://proarab.com/wp-content/uploads/2025/06/%D9%85%D9%86%D8%AF%D9%8A-%D8%A7%D9%84%D9%84%D8%AD%D9%85.jpg',
      badge: 'مميز'
    },
    // --- المقبلات (Appetizers) ---
    {
      id: 2,
      name: 'كريب مشكل فاخر',
      category: 'appetizers',
      price: 11.00,
      description: 'تشكيلة مقرمشة من الكريب المحشية والمقرمشة على اصولها.',
      image: 'https://www.albawaba.com/sites/default/files/im_new/lojain.naser/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D8%A8%20%D8%A8%D8%A7%D9%84%D9%81%D8%B1%D8%A7%D8%AE.jpg'
    },
    {
      id: 5,
      name: 'مقبلات حمص باللحمة',
      category: 'appetizers',
      price: 6.00,
      description: 'حمص ناعم مع زيت الزيتون وقطع اللحم المبرومة والمكسرات.',
      image: 'https://sabrinacooks.com/wp-content/uploads/2025/08/hummus-bil-Lame-819x1024.jpg'
    },
    // --- الشوربة (Soups) ---
    {
      id: 8,
      name: 'شوربة عدس بالمقرمشات',
      category: 'soups',
      price: 4.00,
      description: 'شوربة عدس دافئة ومتبلة عى الطريقة الشرقية مع الخبز المحمص.',
      image: 'https://tse4.mm.bing.net/th/id/OIP.K1INYhlhDC8trtuJzI3GqgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      badge: 'دافئ وطازج'
    },
    {
      id: 9,
      name: 'شوربة لسان عصفور باللحمة',
      category: 'soups',
      price: 4.50,
      description: 'مرقة لحم صافية ومغذية مع حبوب لسان العصفور المحمصة.',
      image: 'https://m7et.com/wp-content/uploads/2020/02/unnamed-19.jpg'
    },
    // --- الحلويات (Desserts) ---
    {
      id: 3,
      name: 'بقلاوة بالفستق',
      category: 'desserts',
      price: 5.00,
      description: 'حلوى شرقية مقرمشة محشوة بأجود أنواع الفستق الحلبي.',
      image: 'https://tse1.mm.bing.net/th/id/OIP.Y6ztmVjSgCrs0mNarPx8OgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      badge: 'جديد'
    },
    {
      id: 10,
      name: 'كنافة بالقشطة والجبنة',
      category: 'desserts',
      price: 6.50,
      description: 'كنافة ذهبية مقرمشة محشية بالقشطة الطازجة والجبنة الساخنة ومسقية بالقطر.',
      image: 'https://d33wubrfki0l68.cloudfront.net/3d8515f1d365c5a0a8363f0e5d0e69587aeff599/d5f44/ar/recipes/kunafa/featured_2_hub6e3f8dc209b40c9147f217b474e1546_215267_800x534_fill_q75_box_bottomleft.jpg',
      badge: 'الأكثر طلباً'
    },
    {
      id: 11,
      name: 'أم علي بالمكسرات والقشطة',
      category: 'desserts',
      price: 5.50,
      description: 'حلوى مصرية تقليدية غنية بالحليب الساخن والمكسرات والزبيب.',
      image: 'https://www.atyabtabkha.com/tachyon/sites/2/2025/11/%D8%A7%D9%85-%D8%B9%D9%84%D9%8A.jpg'
    },
    // --- المشروبات (Drinks) ---
    {
      id: 6,
      name: 'عصير ليمون بالنعناع طازج',
      category: 'drinks',
      price: 3.50,
      description: 'منعش ومحضّر طازجاً يروي العطش في كل الأوقات.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 12,
      name: 'عصير مانجو طبيعي',
      category: 'drinks',
      price: 4.50,
      description: 'عصير مانجو سميك وطازج معصور 100%.',
      image: 'https://sunbeamblobs.blob.core.windows.net/sharedassets/hero-mango.webp?auto=format&fit=crop&q=80'
    },
    {
      id: 13,
      name: 'مشروب كركديه مثلج',
      category: 'drinks',
      price: 3.00,
      description: 'مشروب أسواني تقليدي منعش ومثالي للأجواء الحارة.',
      image: 'https://tse1.mm.bing.net/th/id/OIP.R6CMrKa5MX3Ul_1Hb9XMTwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      id: 14,
      name: 'قهوة تركية مضبوطة',
      category: 'drinks',
      price: 2.50,
      description: 'قهوة أصيلة على البنود الأصلية مع الوش المضبوط.',
      image: 'https://i0.wp.com/bashasaray.com/wp-content/uploads/2022/08/%D9%82%D9%87%D9%88%D8%A9-%D8%AA%D8%B1%D9%83%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A8%D9%86%D8%AF%D9%82.webp?resize=1024%2C683&ssl=1'
    },
    {
      id: 15,
      name: 'كبسة لحم ضاني',
      category: 'mains',
      price: 19.00,
      description: 'أرز بسمتي مبهر على الطريقة التقليدية مع لحم ضاني طري ومكسرات محمصة.',
      image: 'https://www.cairo24.com/Upload/libfiles/106/6/503.webp',
      badge: 'طبق الشيف'
    },
    {
      id: 16,
      name: 'فاهيتا دجاج ساخنة',
      category: 'mains',
      price: 13.50,
      description: 'شرائح دجاج طرية مع الفلفل الـملون والبصل والبهارات الخاصة تقدم مع التورتيلا.',
      image: 'https://media.elwatannews.com/media/img/mediaarc/large/2386322171694008355.jpg'
    },
    {
      id: 17,
      name: 'ستيك ريب آي مشوي',
      category: 'mains',
      price: 22.00,
      description: 'قطعة لحم بقر الفاخرة مشوية على الفحم مع صوص المشروم والبطاطس المهروسة.',
      image: 'https://kitchen.sayidaty.net/uploads/small/a3/a36624a3114926ad2a8a10a881821efe_w750_h500.jpg',
      badge: 'فاخر'
    },
    {
      id: 18,
      name: 'بطاطس مقرمشة بالجبنة والبيكون',
      category: 'appetizers',
      price: 5.50,
      description: 'أصابع بطاطس ذهبية مغطاة بصوص الجبنة السايحة وقطع البيكون المقرمش.',
      image: 'https://tse1.mm.bing.net/th/id/OIP.OFk8AnlMagKGCfiVp7-oVwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      id: 19,
      name: 'شوربة مشروم بالفراخ',
      category: 'soups',
      price: 5.00,
      description: 'شوربة كريمة غنية ودافئة مع قطع الفطر الطازج وصدور الدجاج الطرية.',
      image: 'https://tse2.mm.bing.net/th/id/OIP.aBkp99ESNpxkfofSn2E1KwHaEL?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      badge: 'الأكثر طلباً'
    },
    {
      id: 20,
      name: 'سموذي فراولة طبيعي',
      category: 'drinks',
      price: 4.50,
      description: 'مزيج منعش من الفراولة الطازجة مع الحليب والثلج المجروش.',
      image: 'https://tse1.mm.bing.net/th/id/OIP._daw_AhqIl3KsjwWkn6BOwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      id: 21,
      name: 'مشروب موهيتو بالنعناع والليمون',
      category: 'drinks',
      price: 4.00,
      description: 'مشروب غازي بارد ومنعش بنكهة النعناع الأخضر والليمون الصافي.',
      image: 'https://i.pinimg.com/736x/3b/ad/ff/3badffd959f0597620470f553f0a584a.jpg',
      badge: 'منعش'
    }
  ];

  filteredDishes = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return this.dishes;
    }
    return this.dishes.filter(d => d.category === cat);
  });

  totalPages = computed(() => Math.ceil(this.filteredDishes().length / this.itemsPerPage));

  paginatedDishes = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDishes().slice(start, end);
  });

  filterCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(dish: Dish) {
    this.cartService.addToCart({
      id: dish.id.toString(),
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: 1,
      addons: [],
      unitTotalPrice: dish.price
    });

    this.toastMessage.set(`تم إضافة "${dish.name}" إلى السلة بنجاح!`);

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}