import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { LoadingComponent } from './components/loading/loading';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pb-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingComponent, CommonModule],
  template: `
    @if (!isAdminRoute()) {
      <pb-navbar></pb-navbar>
    }
    <main [class]="isAdminRoute() ? '' : 'min-h-[calc(100vh-200px)]'">
      <router-outlet></router-outlet>
    </main>
    @if (!isAdminRoute()) {
      <pb-footer></pb-footer>
    }
    <pb-loading></pb-loading>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
  private router = inject(Router);

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin'))
    ),
    { initialValue: false }
  );
}
