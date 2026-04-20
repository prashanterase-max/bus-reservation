import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pb-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  private router = inject(Router);

  source = '';
  destination = '';
  date = new Date().toISOString().split('T')[0]; // default to today
  errors = signal<string | null>(null);

  onSearch() {
    if (!this.source.trim()) { this.errors.set('Please enter a source city'); return; }
    if (!this.destination.trim()) { this.errors.set('Please enter a destination city'); return; }
    if (!this.date) { this.errors.set('Please select a travel date'); return; }
    this.errors.set(null);
    this.router.navigate(['/search'], {
      queryParams: {
        source: this.source.trim(),
        destination: this.destination.trim(),
        date: this.date
      }
    });
  }

  searchPopularRoute(source: string, destination: string) {
    this.source = source;
    this.destination = destination;
    this.date = new Date().toISOString().split('T')[0];
    this.onSearch();
  }
}
