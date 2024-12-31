import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PaymentOrdersComponent } from './pages/payment-orders/payment-orders.component';
import { UsersComponent } from './pages/users/users.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { PaymentOrderDetailsComponent } from './pages/payment-order-details/payment-order-details.component';
import { LoginComponent } from './pages/login/login.component';
import { UnauthorizedComponent } from './pages/errors/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './pages/errors/forbidden/forbidden.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { loginGuard } from './guards/login.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ShopComponent } from './pages/shop/shop.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Admin and Customer can access

  },
  {
    path: 'payment-orders',
    component: PaymentOrdersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Customer'] }, // Admin and Customer can access
  },
  {
    path: 'shop',
    component: ShopComponent,
  
  },
  {
    path: 'payment-orders/:id',
    component: PaymentOrderDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Customer'] }, // Admin and Customer can access
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Only Admin can access
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Customer'] }, // Admin and Customer can view products
  },
  {
    path: 'products/create',
    component: ProductFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Only Admin can create products
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Only Admin can edit products
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Customer'] }, // Admin and Customer can view categories
  },
  {
    path: 'categories/create',
    component: CategoryFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Only Admin can create categories
  },
  {
    path: 'categories/edit/:id',
    component: CategoryFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Only Admin can edit categories
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent ,
    data: { roles: ['Admin', 'Customer'] }, // Admin and Customer can view categories
  },
  { path: '401', component: UnauthorizedComponent },
  { path: '403', component: ForbiddenComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
