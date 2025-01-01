import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  lowStockProducts: Product[] = [];
  recentActivities: string[] = [];

  productCategoryChartData: any;
  productCategoryChartOptions: any;

  lowStockChartData: any;
  lowStockChartOptions: any;

  isProductCategoryChartDataAvailable = false;
  isLowStockChartDataAvailable = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  async fetchProducts(): Promise<void> {
    try {
      const products = (await this.productService.getAllProducts().toPromise()) || [];
      this.products = products;
      this.lowStockProducts = products.filter((p) => p.stockQuantity < 10);
      this.initProductCategoryChart();
      this.initLowStockChart();
      this.addRecentActivity('Fetched product data.');
    } catch (error) {
      console.error('Failed to fetch products:', error);
      this.addRecentActivity('Failed to fetch product data.');
      this.isProductCategoryChartDataAvailable = false;
      this.isLowStockChartDataAvailable = false;
    }
  }

  async fetchCategories(): Promise<void> {
    try {
      const categories = (await this.categoryService.getCategories().toPromise()) || [];
      this.categories = categories;
      this.addRecentActivity('Fetched category data.');
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      this.addRecentActivity('Failed to fetch category data.');
    }
  }

  initProductCategoryChart(): void {
    const categoryCounts: { [key: string]: number } = {};

    this.products.forEach((product) => {
      const category = this.categories.find((c) => c.id === product.categoryId);
      const categoryName = category ? category.name : 'Unknown';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    this.isProductCategoryChartDataAvailable = Object.keys(categoryCounts).length > 0;

    this.productCategoryChartData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: 'Products per Category',
          data: Object.values(categoryCounts),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC'],
        },
      ],
    };

    this.productCategoryChartOptions = {
      responsive: true,
    };
  }

  initLowStockChart(): void {
    this.isLowStockChartDataAvailable = this.lowStockProducts.length > 0;

    this.lowStockChartData = {
      labels: this.lowStockProducts.map((p) => p.name),
      datasets: [
        {
          label: 'Stock Quantity',
          data: this.lowStockProducts.map((p) => p.stockQuantity),
          backgroundColor: '#FF7043',
        },
      ],
    };

    this.lowStockChartOptions = {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    };
  }

  addRecentActivity(activity: string): void {
    this.recentActivities.unshift(`${new Date().toLocaleString()}: ${activity}`);
    if (this.recentActivities.length > 10) {
      this.recentActivities.pop();
    }
  }
}
