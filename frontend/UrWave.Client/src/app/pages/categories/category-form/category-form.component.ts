import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  providers: [MessageService],
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEdit = false;
  categoryId!: string;

  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Check if it's an edit
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.categoryId = params['id'];
        this.loadCategory();
      }
    });
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.maxLength(200)]],
      parentCategoryId: [''],
      status: [1, Validators.required], // Default to Active
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => this.categoryForm.patchValue(category),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load category data.',
        }),
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const categoryData: Category = this.categoryForm.value;

    if (this.isEdit) {
      // Update Category
      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category updated successfully.',
          });
          this.router.navigate(['/categories']);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update category.',
          }),
      });
    } else {
      // Create Category
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category created successfully.',
          });
          this.router.navigate(['/categories']);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create category.',
          }),
      });
    }
  }
}
