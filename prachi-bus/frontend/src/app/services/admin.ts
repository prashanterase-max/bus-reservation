import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = 'http://localhost:5001/api/admin';

  private get h() {
    return new HttpHeaders().set('x-auth-token', this.auth.token() || '');
  }

  // Stats
  getStats() { return firstValueFrom(this.http.get<any>(`${this.base}/stats`, { headers: this.h })); }

  // Users
  getUsers() { return firstValueFrom(this.http.get<any[]>(`${this.base}/users`, { headers: this.h })); }
  createUser(d: any) { return firstValueFrom(this.http.post<any>(`${this.base}/users`, d, { headers: this.h })); }
  updateUser(id: string, d: any) { return firstValueFrom(this.http.put<any>(`${this.base}/users/${id}`, d, { headers: this.h })); }
  deleteUser(id: string) { return firstValueFrom(this.http.delete<any>(`${this.base}/users/${id}`, { headers: this.h })); }

  // Buses
  getBuses() { return firstValueFrom(this.http.get<any[]>(`${this.base}/buses`, { headers: this.h })); }
  createBus(d: any) { return firstValueFrom(this.http.post<any>(`${this.base}/buses`, d, { headers: this.h })); }
  updateBus(id: string, d: any) { return firstValueFrom(this.http.put<any>(`${this.base}/buses/${id}`, d, { headers: this.h })); }
  deleteBus(id: string) { return firstValueFrom(this.http.delete<any>(`${this.base}/buses/${id}`, { headers: this.h })); }

  // Bookings
  getBookings() { return firstValueFrom(this.http.get<any[]>(`${this.base}/bookings`, { headers: this.h })); }
  setBookingStatus(id: string, status: string) { return firstValueFrom(this.http.put<any>(`${this.base}/bookings/${id}/status`, { status }, { headers: this.h })); }
  deleteBooking(id: string) { return firstValueFrom(this.http.delete<any>(`${this.base}/bookings/${id}`, { headers: this.h })); }

  // Messages
  getMessages() { return firstValueFrom(this.http.get<any[]>(`${this.base}/messages`, { headers: this.h })); }
  markMessageRead(id: string) { return firstValueFrom(this.http.put<any>(`${this.base}/messages/${id}/read`, {}, { headers: this.h })); }
  deleteMessage(id: string) { return firstValueFrom(this.http.delete<any>(`${this.base}/messages/${id}`, { headers: this.h })); }
}
