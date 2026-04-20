import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { BookingService, BookingData } from '../../services/booking';
import { BusService } from '../../services/bus';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pb-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private bookingService = inject(BookingService);
  public busService = inject(BusService);

  user = signal<User | null>(null);
  bookings = signal<BookingData[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.user.set(this.authService.user());
    this.fetchBookings();
    this.busService.getAllBuses();
  }

  async fetchBookings() {
    try {
      const data = await this.bookingService.getUserBookings();
      this.bookings.set(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
