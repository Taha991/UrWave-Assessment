import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Add this for p-confirmDialog
import { DialogModule } from 'primeng/dialog'; // Add this for p-dialog
import { FormsModule } from '@angular/forms'; // Add this for [(ngModel)]
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule, // Added for p-confirmDialog
    DialogModule, // Added for p-dialog
    FormsModule, // Added for [(ngModel)]
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  categoriesDropdown: { label: string; value: string }[] = [];
  loading = true;

  showReassignDialog = false;
  deletingCategoryId: string | any = null;
  reassignCategoryId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesWithParent().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesDropdown = categories.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories.',
        });
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/categories/create']);
  }

  onEdit(categoryId: string): void {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  confirmDelete(categoryId: string): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        if (products.length > 0) {
          // Category has products
          this.deletingCategoryId = categoryId;
          this.showReassignDialog = true;
        } else {
          // No products, confirm deletion
          this.confirmationService.confirm({
            message: 'Are you sure you want to delete this category?',
            accept: () => this.deleteCategory(categoryId),
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check category dependencies.',
        });
      },
    });
  }

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully.',
        });
        this.loadCategories();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete category.',
        }),
    });
  }
  
  reassignCategory(): void {
    if (this.deletingCategoryId && this.reassignCategoryId) {
        const payload = {
            oldCategoryId: this.deletingCategoryId,
            newCategoryId: this.reassignCategoryId,
        };

        this.categoryService.reassignProductsCategory(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Products reassigned successfully.',
                });
                this.deleteCategory(this.deletingCategoryId);
                this.cancelReassign();
            },
            error: (err) => {
                const errorMessage = err.error?.Message || 'Failed to reassign products.';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                });
            },
        });
    } else {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a valid category for reassignment.',
        });
    }
}


  
  
  

  cancelReassign(): void {
    this.showReassignDialog = false;
    this.deletingCategoryId = null;
    this.reassignCategoryId = null;
  }
}
