import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status: number;
  stockQuantity: number;
  createdDate?: Date;
  updatedDate?: Date;
}
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
export interface ProductDisplay extends Product {
  statusName: string; // For display
  categoryName: string; // For display
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7024/products'; // Replace with actual API URL
  private http = inject(HttpClient);

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side or network error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(catchError(this.handleError));
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getPaginatedProducts(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: string,
    categoryId?: string,
    status?: string,
    minPrice?: number,
    maxPrice?: number
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (status) params = params.set('status', status);
    if (minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

}
