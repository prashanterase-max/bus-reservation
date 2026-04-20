import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'pb-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  name = '';
  email = '';
  password = '';
  phone = '';
  error = signal<string | null>(null);
  loading = signal(false);
  returnUrl = signal<string | null>(null);

  ngOnInit() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
  }

  async onRegister() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone
      });
      this.router.navigate([this.returnUrl()]);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
