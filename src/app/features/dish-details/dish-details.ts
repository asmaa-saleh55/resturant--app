import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-dish-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dish-details.html',
  styleUrl: './dish-details.css'
})
export class DishDetailsComponent implements OnInit {
  dishId: string | null = null;
  quantity: number = 1;
  dish: any = null;
  
  // تحويل التوست لـ signal عشان يختفي بعد 3 ثواني بدقة
  showToast = signal<boolean>(false);
  toastMessage: string = '';
  private toastTimeout: any;

  // الإضافات الاختيارية مع صور واضحة ومضمونة
  addons = [
    { 
      name: 'جبنة إضافية', 
      price: 1.00, 
      selected: false, 
      image: 'https://as1.ftcdn.net/jpg/07/56/98/88/1000_F_756988808_ECElWVkG8Wt49uao0yWD6gHEgGqviLdM.jpg' 
    },
    { 
      name: 'صوص حار خاص', 
      price: 0.50, 
      selected: false, 
      image: 'https://png.pngtree.com/png-clipart/20240222/original/pngtree-cocktail-sauce-ingredients-mayonnaise-ketchup-and-hot-pepperisolated-on-photo-png-image_14382800.png' 
    },
    { 
      name: 'مشروب غازي بارد', 
      price: 2.00, 
      selected: false, 
      image: 'https://www.alsumaria.tv/uploadImages/DocumentImages/Doc-P-327047-637110547565281491.jpg' 
    }
  ];

  allDishes = [
    { id: '1', name: 'شاورما دجاج مميزة', category: 'mains', price: 3.00, description: 'تقدم مع الثومية والبطاطس الطازجة والخبز الساخن.', image: 'https://png.pngtree.com/background/20250103/original/pngtree-arabic-chicken-shawarma-generate-ai-picture-image_15514444.jpg', badge: 'الأكثر طلباً', prepTime: '20 دقيقة' },
    { id: '2', name: 'كريب مشكل فاخر', category: 'appetizers', price: 11.00, description: 'تشكيلة مقرمشة من الكريب المحشية والمقرمشة على اصولها.', image: 'https://www.albawaba.com/sites/default/files/im_new/lojain.naser/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D8%A8%20%D8%A8%D8%A7%D9%84%D9%81%D8%B1%D8%A7%D8%AE.jpg', prepTime: '15 دقيقة' },
    { id: '3', name: 'بقلاوة بالفستق', category: 'desserts', price: 5.00, description: 'حلوى شرقية مقرمشة محشوة بأجود أنواع الفستق الحلبي.', image: 'https://tse1.mm.bing.net/th/id/OIP.Y6ztmVjSgCrs0mNarPx8OgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', badge: 'جديد', prepTime: '10 دقائق' },
    { id: '4', name: 'مشاوي مشكلة ملكية', category: 'mains', price: 15.00, description: 'سيخ كباب، تكا، وشيش طاووق يقدم مع الأرز البسمتي.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', prepTime: '30 دقيقة' },
    { id: '5', name: 'مقبلات حمص باللحمة', category: 'appetizers', price: 6.00, description: 'حمص ناعم مع زيت الزيتون وقطع اللحم المبرومة والمكسرات.', image: 'https://sabrinacooks.com/wp-content/uploads/2025/08/hummus-bil-Lame-819x1024.jpg', prepTime: '10 دقائق' },
    { id: '6', name: 'عصير ليمون بالنعناع طازج', category: 'drinks', price: 3.50, description: 'منعش ومحضّر طازجاً يروي العطش في كل الأوقات.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', prepTime: '5 دقائق' },
    { id: '7', name: 'مندي لحم على الطريقة التقليدية', category: 'mains', price: 18.50, description: 'قطع لحم طرية مطبوخة ببطء مع الأرز البهارات الخليجية الأصيلة.', image: 'https://proarab.com/wp-content/uploads/2025/06/%D9%85%D9%86%D8%AF%D9%8A-%D8%A7%D9%84%D9%84%D8%AD%D9%85.jpg', badge: 'مميز', prepTime: '40 دقيقة' },
    { id: '8', name: 'شوربة عدس بالمقرمشات', category: 'soups', price: 4.00, description: 'شوربة عدس دافئة ومتبلة على الطريقة الشرقية مع الخبز المحمص.', image: 'https://tse4.mm.bing.net/th/id/OIP.K1INYhlhDC8trtuJzI3GqgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', badge: 'دافئ وطازج', prepTime: '15 دقيقة' },
    { id: '9', name: 'شوربة لسان عصفور باللحمة', category: 'soups', price: 4.50, description: 'مرقة لحم صافية ومغذية مع حبوب لسان العصفور المحمصة.', image: 'https://m7et.com/wp-content/uploads/2020/02/unnamed-19.jpg', prepTime: '15 دقيقة' },
    { id: '10', name: 'كنافة بالقشطة والجبنة', category: 'desserts', price: 6.50, description: 'كنافة ذهبية مقرمشة محشية بالقشطة الطازجة والجبنة الساخنة ومسقية بالقطر.', image: 'https://d33wubrfki0l68.cloudfront.net/3d8515f1d365c5a0a8363f0e5d0e69587aeff599/d5f44/ar/recipes/kunafa/featured_2_hub6e3f8dc209b40c9147f217b474e1546_215267_800x534_fill_q75_box_bottomleft.jpg', badge: 'الأكثر طلباً', prepTime: '20 دقيقة' },
    { id: '11', name: 'أم علي بالمكسرات والقشطة', category: 'desserts', price: 5.50, description: 'حلوى مصرية تقليدية غنية بالحليب الساخن والمكسرات والزبيب.', image: 'https://www.atyabtabkha.com/tachyon/sites/2/2025/11/%D8%A7%D9%85-%D8%B9%D9%84%D9%8A.jpg', prepTime: '15 دقيقة' },
    { id: '12', name: 'عصير مانجو طبيعي', category: 'drinks', price: 4.50, description: 'عصير مانجو سميك وطازج معصور 100%.', image: 'https://sunbeamblobs.blob.core.windows.net/sharedassets/hero-mango.webp?auto=format&fit=crop&q=80', prepTime: '5 دقائق' },
    { id: '13', name: 'مشروب كركديه مثلج', category: 'drinks', price: 3.00, description: 'مشروب أسواني تقليدي منعش ومثالي للأجواء الحارة.', image: 'https://tse1.mm.bing.net/th/id/OIP.R6CMrKa5MX3Ul_1Hb9XMTwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', prepTime: '5 دقائق' },
    { id: '14', name: 'قهوة تركية مضبوطة', category: 'drinks', price: 2.50, description: 'قهوة أصيلة على البنود الأصلية مع الوش المضبوط.', image: 'https://i0.wp.com/bashasaray.com/wp-content/uploads/2022/08/%D9%82%D9%87%D9%88%D8%A9-%D8%AA%D8%B1%D9%83%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A8%D9%86%D8%AF%D9%82.webp?resize=1024%2C683&ssl=1', prepTime: '5 دقائق' },
    { id: '15', name: 'كبسة لحم ضاني', category: 'mains', price: 19.00, description: 'أرز بسمتي مبهر على الطريقة التقليدية مع لحم ضاني طري ومكسرات محمصة.', image: 'https://www.cairo24.com/Upload/libfiles/106/6/503.webp', badge: 'طبق الشيف', prepTime: '35 دقيقة' },
    { id: '16', name: 'فاهيتا دجاج ساخنة', category: 'mains', price: 13.50, description: 'شرائح دجاج طرية مع الفلفل الملَون والبصل والبهارات الخاصة.', image: 'https://media.elwatannews.com/media/img/mediaarc/large/2386322171694008355.jpg', prepTime: '20 دقيقة' },
    { id: '17', name: 'ستيك ريب آي مشوي', category: 'mains', price: 22.00, description: 'قطعة لحم بقر الفاخرة مشوية على الفحم مع صوص المشروم والبطاطس.', image: 'https://kitchen.sayidaty.net/uploads/small/a3/a36624a3114926ad2a8a10a881821efe_w750_h500.jpg', badge: 'فاخر', prepTime: '30 دقيقة' },
    { id: '18', name: 'بطاطس مقرمشة بالجبنة والبيكون', category: 'appetizers', price: 5.50, description: 'أصابع بطاطس ذهبية مغطاة بصوص الجبنة السايحة وقطع البيكون.', image: 'https://tse1.mm.bing.net/th/id/OIP.OFk8AnlMagKGCfiVp7-oVwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', prepTime: '10 دقائق' },
    { id: '19', name: 'شوربة مشروم بالفراخ', category: 'soups', price: 5.00, description: 'شوربة كريمة غنية ودافئة مع قطع الفطر الطازج وصدور الدجاج الطرية.', image: 'https://tse2.mm.bing.net/th/id/OIP.aBkp99ESNpxkfofSn2E1KwHaEL?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', badge: 'الأكثر طلباً', prepTime: '15 دقيقة' },
    { id: '20', name: 'سموذي فراولة طبيعي', category: 'drinks', price: 4.50, description: 'مزيج منعش من الفراولة الطازجة مع الحليب والثلج المجروش.', image: 'https://tse1.mm.bing.net/th/id/OIP._daw_AhqIl3KsjwWkn6BOwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', prepTime: '5 دقائق' },
    { id: '21', name: 'مشروب موهيتو بالنعناع والليمون', category: 'drinks', price: 4.00, description: 'مشروب غازي بارد ومنعش بنكهة النعناع الأخضر والليمون الصافي.', image: 'https://i.pinimg.com/736x/3b/ad/ff/3badffd959f0597620470f553f0a584a.jpg', badge: 'منعش', prepTime: '5 دقائق' }
  ];

  constructor(private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.dishId = params.get('id');
      this.dish = this.allDishes.find(d => d.id === this.dishId) || this.allDishes[0];
    });
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get totalPrice(): number {
    if (!this.dish) return 0;
    let addonsTotal = this.addons
      .filter(a => a.selected)
      .reduce((sum, a) => sum + a.price, 0);
    return (this.dish.price + addonsTotal) * this.quantity;
  }

  addToCart() {
    const selectedAddons = this.addons.filter(a => a.selected);
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  
    this.cartService.addToCart({
      id: this.dish.id,
      name: this.dish.name,
      price: this.dish.price,
      image: this.dish.image,
      quantity: this.quantity,
      addons: selectedAddons.map(a => a.name),
      unitTotalPrice: this.dish.price + addonsTotal
    });
  
    this.toastMessage = `تم إضافة ${this.quantity} من (${this.dish.name}) إلى السلة بنجاح!`;
    this.showToast.set(true); // تفعيل الـ signal لإظهار التوست
  
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // إخفاء التوست بعد 3 ثواني بالظبط
    this.toastTimeout = setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}