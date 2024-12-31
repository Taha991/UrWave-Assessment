import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  favoriteCategory = ''; // Selected category ID
  filteredProducts: any[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
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

  loadProductsByCategory(categoryId: string): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: () => {
        console.error('Failed to load products.');
      },
    });
  }

  onCategoryChange(): void {
    if (this.favoriteCategory) {
      this.loadProductsByCategory(this.favoriteCategory);
    } else {
      this.filteredProducts = [];
    }
  }
}
