import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'pb-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  private http = inject(HttpClient);

  name = '';
  email = '';
  message = '';
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  async onSubmit() {
    if (!this.name || !this.email || !this.message) {
      this.error.set('All fields are required');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.http.post('https://bus-reservation-red.vercel.app/api/contact', {
        name: this.name, email: this.email, message: this.message
      }));
      this.success.set(true);
      this.name = ''; this.email = ''; this.message = '';
    } catch {
      this.error.set('Failed to send message. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
