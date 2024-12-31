import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService, private router: Router) {
    // Observable to track login state
    this.isLoggedIn$ = this.auth.currentUser.pipe(map((user) => !!user));
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.auth.logout();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }
  
}