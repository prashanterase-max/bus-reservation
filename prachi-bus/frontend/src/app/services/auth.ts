import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5001/api/auth';

  user = signal<User | null>(this.getUserFromStorage());
  token = signal<string | null>(localStorage.getItem('token'));
  isAuthenticated = computed(() => !!this.token());

  constructor() {
    // Refresh user from server on app load to pick up role changes
    if (this.token()) {
      firstValueFrom(this.http.get<any>(`${this.apiUrl}/me`, {
        headers: { 'x-auth-token': this.token()! }
      })).then(u => {
        const fresh: User = { id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role };
        this.user.set(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      }).catch(() => {});
    }
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async register(userData: any) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/register`, userData));
      this.setAuth(res);
    } catch (err) {
      throw err;
    }
  }

  async login(credentials: any) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/login`, credentials));
      this.setAuth(res);
    } catch (err) {
      throw err;
    }
  }

  private setAuth(res: any) {
    this.token.set(res.token);
    this.user.set(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
