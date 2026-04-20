import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pb-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent implements OnInit {
  private router = inject(Router);
  public bookingService = inject(BookingService);

  paymentMethod = 'UPI';
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    if (!this.bookingService.getBookingData()) {
      this.router.navigate(['/']);
    }
  }

  async onPay() {
    this.loading.set(true);
    this.error.set(null);
    // Simulate payment processing
    try {
      const res = await this.bookingService.createBooking();
      if (res && res.pnr) {
        this.loading.set(false);
        this.router.navigate(['/confirmation', res.pnr]);
      } else {
        throw new Error('PNR not generated');
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      this.error.set(err.error?.message || 'Booking failed. Please try again.');
      this.loading.set(false);
    }
  }
}
