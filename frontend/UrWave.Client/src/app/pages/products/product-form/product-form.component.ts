import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [MessageService],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEdit = false;
  productId!: string;

  categories: { label: string; value: string }[] = [];
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Discontinued', value: 'Discontinued' },
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Fetch categories for dropdown
    this.categoryService.getCategoriesForDropdown().subscribe({
      next: (categories) => {
        this.categories = categories.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories.',
        }),
    });

    // Check if it's an edit
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = params['id'];
        this.loadProduct();
      }
    });
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      status: ['Active', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          ...product,
          categoryId: product.categoryId, // Ensure categoryId is properly mapped
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product data.',
        }),
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData: Product = this.productForm.value;

    if (this.isEdit) {
      // Update Product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully.',
          });
          this.router.navigate(['/products']);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product.',
          }),
      });
    } else {
      // Create Product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully.',
          });
          this.router.navigate(['/products']);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create product.',
          }),
      });
    }
  }
}
