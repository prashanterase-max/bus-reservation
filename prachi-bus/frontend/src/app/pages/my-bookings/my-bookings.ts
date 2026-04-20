import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService, BookingData } from '../../services/booking';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'pb-my-bookings',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  bookings = signal<BookingData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchBookings();
  }

  async fetchBookings() {
    try {
      const data = await this.bookingService.getUserBookings();
      this.bookings.set(data || []);
    } catch (err: any) {
      this.error.set('Failed to fetch bookings.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
