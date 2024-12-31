import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface User {
  id: string;
  Username: string;
  Email: string;
  Password: string;
  Role: string;
  createdOn: Date;
}
export interface UserCreateDto {
  Username: string;
  Email: string;
  Password: string;
  Role: string; // Admin or Customer
}
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdDate: string; // Keep it as string if it is ISO format from backend
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7024/users';

  http = inject(HttpClient);

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side or network error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Failed to fetch all users:', error);
        return throwError(() => new Error('Unable to fetch users. Please try again later.'));
      })
    );
  }
  

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  

  createUser(user: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  
  updateUser(id: string, user: UserCreateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
}

