import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'menu', 
    loadComponent: () => import('./features/menu/menu').then(m => m.MenuComponent) 
  },
  { 
    path: 'menu/:id', 
    loadComponent: () => import('./features/dish-details/dish-details').then(m => m.DishDetailsComponent) 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./features/about/about').then(m => m.AboutComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./features/contact/contact').then(m => m.ContactComponent) 
  },
  { 
    path: 'my-orders', 
    loadComponent: () => import('./features/my-orders/my-orders').then(m => m.MyOrdersComponent) 
  }
];