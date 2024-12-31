import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table'; // For p-table
import { ButtonModule } from 'primeng/button'; // For buttons
import { CommonModule } from '@angular/common'; // For Angular directives like *ngIf, *ngFor

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [MessageService],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
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
    this.router.navigate(['/products/create']);
  }
  
  onEdit(categoryId: string): void {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  onDelete(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
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
  }
}
