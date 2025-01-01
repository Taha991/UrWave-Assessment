import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule, // For ngModel
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [MessageService],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  bulkStatus: number | null = null; // For bulk status update
  bulkCategory: string | null = null; // For bulk category reassignment
  selectedProducts: Product[] = []; // For batch operations

  // Filters
  searchQuery = ''; // Search by name
  categoryId = '';
  status: number | null = null;
  minPrice?: number;
  maxPrice?: number;
  sortBy = '';
  sortOrder = '';

  categories: { label: string; value: string }[] = [];
  statuses = [
    { label: 'All', value: null },
    { label: 'Active', value: 0 },
    { label: 'Inactive', value: 1 },
    { label: 'Discontinued', value: 2 },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = [{ label: 'All', value: '' }, ...data.map((category) => ({
          label: category.name,
          value: category.id,
        }))];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories.',
        });
      },
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getPaginatedProducts(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortOrder,
        this.categoryId,
        this.status?.toString(),
        this.minPrice,
        this.maxPrice
      )
      .subscribe({
        next: (data) => {
          this.products = data.data.map((product) => ({
            ...product,
            statusName: this.getStatusName(product.status),
            categoryName: this.getCategoryName(product.categoryId),
          }));
          this.totalItems = data.totalItems;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products.',
          });
        },
      });
  }

  applySearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.categoryId = '';
    this.status = null;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    
    this.applyFilters();
  }

  onBatchDelete(): void {
    const ids = this.selectedProducts.map((p) => p.id);
    this.productService.deleteProducts(ids).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Selected products deleted.',
        });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete selected products.',
        });
      },
    });
  }
  onBatchUpdateStatus(): void {
    if (this.bulkStatus === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a status before updating.',
      });
      return;
    }
  
    const ids = this.selectedProducts.map((p) => p.id);
    this.productService.updateProductsStatus(ids, this.bulkStatus).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status updated for selected products.',
        });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update status.',
        });
      },
    });
  }
  
  onBatchReassignCategory(): void {
    if (!this.bulkCategory) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a category before reassigning.',
      });
      return;
    }
  
    const ids = this.selectedProducts.map((p) => p.id);
    this.productService.reassignProductsCategory(ids, this.bulkCategory).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category reassigned for selected products.',
        });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to reassign category.',
        });
      },
    });
  }
  
  getStatusName(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Active',
      1: 'Inactive',
      2: 'Discontinued',
    };
    return statusMap[status] || 'Unknown';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.value === categoryId);
    return category?.label || 'Unknown';
  }

  onCreate(): void {
    this.router.navigate(['/products/create']);
  }

  onEdit(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }
  applyGlobalFilter(event: Event, dt: any): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(value, 'contains');
  }
  applyColumnFilter(event: Event, field: string, dt: any): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filter(value, field, 'contains');
  }
  onDelete(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product deleted successfully.',
          });
          this.loadProducts();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete product.',
          }),
      });
    }
  }
}
