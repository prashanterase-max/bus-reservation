import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService, Bus } from '../../services/bus';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pb-seat-selection',
  imports: [CommonModule],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.css'
})
export class SeatSelectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private busService = inject(BusService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  bus = signal<Bus | null>(null);
  selectedSeats = signal<number[]>([]);
  bookedSeats = signal<number[]>([5, 12, 18, 24]); // Dummy booked seats for now

  ngOnInit() {
    const busId = this.route.snapshot.paramMap.get('busId');
    if (busId) {
      this.busService.getBusById(busId).then(data => {
        this.bus.set(data);
      });
    }
  }

  toggleSeat(seatNumber: number) {
    if (this.bookedSeats().includes(seatNumber)) return;

    this.selectedSeats.update(seats => {
      if (seats.includes(seatNumber)) {
        return seats.filter(s => s !== seatNumber);
      } else {
        return [...seats, seatNumber];
      }
    });
  }

  isSeatSelected(seatNumber: number) {
    return this.selectedSeats().includes(seatNumber);
  }

  isSeatBooked(seatNumber: number) {
    return this.bookedSeats().includes(seatNumber);
  }

  proceedToDetails() {
    if (this.selectedSeats().length > 0) {
      // Store selected bus and seats in service
      this.bookingService.setBookingData({
        bus: this.bus()!,
        selectedSeats: this.selectedSeats()
      });

      const targetUrl = '/passenger-details';
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: targetUrl } });
      } else {
        this.router.navigate([targetUrl]);
      }
    }
  }
}
