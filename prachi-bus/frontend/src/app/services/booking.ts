import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Bus } from './bus';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth';

export interface Passenger {
  name: string;
  age: number;
  gender: string;
}

export interface BookingData {
  _id?: string;
  bus: Bus;
  selectedSeats: number[];
  passengerDetails?: Passenger[];
  totalAmount?: number;
  pnr?: string;
  journeyDate?: string;
  bookingDate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://your-backend.vercel.app/api/bookings';
  bookingData = signal<BookingData | null>(null);

  setBookingData(data: BookingData) {
    this.bookingData.set({
      ...data,
      totalAmount: data.selectedSeats.length * data.bus.fare
    });
  }

  getBookingData() {
    return this.bookingData();
  }

  updatePassengers(passengers: Passenger[]) {
    this.bookingData.update(data => data ? { ...data, passengerDetails: passengers } : null);
  }

  async createBooking() {
    const data = this.bookingData();
    if (!data) return null;

    const token = this.authService.token();
    const headers = new HttpHeaders().set('x-auth-token', token || '');

    const body = {
      busId: data.bus._id,
      selectedSeats: data.selectedSeats,
      passengerDetails: data.passengerDetails,
      totalAmount: data.totalAmount,
      journeyDate: new Date() // In a real app, use the selected date
    };

    try {
      const res = await firstValueFrom(this.http.post<any>(this.apiUrl, body, { headers }));
      return res;
    } catch (err) {
      throw err;
    }
  }

  async getUserBookings() {
    const token = this.authService.token();
    const headers = new HttpHeaders().set('x-auth-token', token || '');
    try {
      return await firstValueFrom(this.http.get<BookingData[]>(`${this.apiUrl}/my-bookings`, { headers }));
    } catch (err) {
      throw err;
    }
  }
}
