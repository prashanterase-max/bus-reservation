import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Bus {
  _id: string;
  name: string;
  type: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  seatsAvailable: number;
  rating: number;
  reviewsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private apiUrl = 'https://your-backend.vercel.app/api/buses';

  buses = signal<Bus[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async getAllBuses() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(this.http.get<Bus[]>(this.apiUrl));
      this.buses.set(data);
    } catch (err) {
      this.error.set('Failed to load buses. Please try again.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  async searchBuses(source: string, destination: string, date: string) {
    this.loading.set(true);
    this.error.set(null);
    this.buses.set([]); // clear stale results immediately
    try {
      const data = await firstValueFrom(
        this.http.get<Bus[]>(`${this.apiUrl}/search`, {
          params: { source, destination, date }
        })
      );
      this.buses.set(data);
    } catch (err) {
      this.error.set('Failed to search buses. Please try again.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  async getBusById(id: string) {
    return firstValueFrom(this.http.get<Bus>(`${this.apiUrl}/${id}`));
  }
}
