import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of , throwError } from 'rxjs';
import { map, catchError ,  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7024/users';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); // Store role
          this.currentUserSubject.next({ token: response.token, role: response.role });
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        // Re-throw the error so the caller can handle it
        return throwError(() => error);
      })
    );
  }
  

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .subscribe({
        next: () => {
          console.log('Logout successful');
        },
        error: (error) => {
          console.error('Logout failed:', error);
        },
        complete: () => {
          // Clear client-side storage after the logout request completes
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.currentUserSubject.next(null);
        },
      });
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role'); // Get role from storage
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
