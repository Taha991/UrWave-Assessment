import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule], // Add CommonModule here
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

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.lowStockProducts = products.filter((p) => p.stockQuantity < 10);
        this.initProductCategoryChart();
        this.initLowStockChart();
        this.addRecentActivity('Fetched product data.');
      },
      error: () => {
        this.addRecentActivity('Failed to fetch product data.');
        this.isProductCategoryChartDataAvailable = false;
        this.isLowStockChartDataAvailable = false;
      },
    });
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.addRecentActivity('Fetched category data.');
      },
      error: () => {
        this.addRecentActivity('Failed to fetch category data.');
      },
    });
  }

  initProductCategoryChart(): void {
    const categoryCounts: { [key: string]: number } = {};

    this.products.forEach((product) => {
      const category = this.categories.find((c) => c.id === product.categoryId);
      const categoryName = category ? category.name : 'Unknown';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    if (Object.keys(categoryCounts).length === 0) {
      this.isProductCategoryChartDataAvailable = false;
    } else {
      this.isProductCategoryChartDataAvailable = true;
      this.productCategoryChartData = {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            label: 'Products per Category',
            data: Object.values(categoryCounts),
            backgroundColor: [
              '#42A5F5',
              '#66BB6A',
              '#FFA726',
              '#FF7043',
              '#AB47BC',
            ],
          },
        ],
      };

      this.productCategoryChartOptions = {
        responsive: true,
      };
    }
  }

  initLowStockChart(): void {
    if (this.lowStockProducts.length === 0) {
      this.isLowStockChartDataAvailable = false;
    } else {
      this.isLowStockChartDataAvailable = true;
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
          y: {
            beginAtZero: true,
          },
        },
      };
    }
  }

  addRecentActivity(activity: string): void {
    this.recentActivities.unshift(`${new Date().toLocaleString()}: ${activity}`);
    if (this.recentActivities.length > 10) {
      this.recentActivities.pop();
    }
  }
}
