import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingService, BookingData } from '../../services/booking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pb-confirmation',
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class ConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);

  pnr = signal('');
  bookingDetails = signal<BookingData | null>(null);

  ngOnInit() {
    this.pnr.set(this.route.snapshot.paramMap.get('pnr') || '');
    const data = this.bookingService.getBookingData();
    if (data) {
      this.bookingDetails.set(data);
    } else {
      // In a real app, fetch by PNR from backend
      this.router.navigate(['/']);
    }
  }

  printTicket() {
    window.print();
  }
}
