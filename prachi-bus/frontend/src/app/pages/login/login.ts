import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'pb-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);
  returnUrl = signal<string | null>(null);

  ngOnInit() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
  }

  async onLogin() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.login({
        email: this.email,
        password: this.password
      });
      this.router.navigate([this.returnUrl()]);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      this.loading.set(false);
    }
  }
}
