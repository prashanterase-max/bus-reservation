import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'pb-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
