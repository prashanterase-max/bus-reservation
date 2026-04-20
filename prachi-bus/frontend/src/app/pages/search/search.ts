import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BusService } from '../../services/bus';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pb-search',
  imports: [CommonModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public busService = inject(BusService);

  source = '';
  destination = '';
  date = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
      this.destination = params['destination'];
      this.date = params['date'];
      if (this.source && this.destination) {
        this.busService.searchBuses(this.source, this.destination, this.date);
      }
    });
  }

  selectBus(busId: string) {
    this.router.navigate(['/seat-selection', busId]);
  }
}
