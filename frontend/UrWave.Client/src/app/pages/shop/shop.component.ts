import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule,
    FormsModule, // For template-driven forms and pipes
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  favoriteCategory = ''; // The customer's selected favorite category
  filteredProducts: any[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        console.error('Failed to load categories.');
      },
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProductsByCategory();
      },
      error: () => {
        console.error('Failed to load products.');
      },
    });
  }

  filterProductsByCategory(): void {
    this.filteredProducts = this.products.filter(
      (product) => product.category === this.favoriteCategory
    );
  }
}
