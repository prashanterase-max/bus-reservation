import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService, Passenger } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pb-passenger-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger-details.html',
  styleUrl: './passenger-details.css'
})
export class PassengerDetailsComponent implements OnInit {
  private router = inject(Router);
  public bookingService = inject(BookingService);
  public authService = inject(AuthService);

  passengers: Passenger[] = [];

  ngOnInit() {
    const data = this.bookingService.getBookingData();
    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    // Initialize passenger forms based on selected seats
    this.passengers = data.selectedSeats.map(() => ({
      name: '',
      age: 0,
      gender: 'Male'
    }));
  }

  async proceedToPayment() {
    if (this.passengers.every(p => p.name && p.age > 0)) {
      this.bookingService.updatePassengers(this.passengers);
      
      // Check if logged in before payment
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/payment' } });
      } else {
        this.router.navigate(['/payment']);
      }
    }
  }
}
