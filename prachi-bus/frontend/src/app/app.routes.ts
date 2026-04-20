import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SearchComponent } from './pages/search/search';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection';
import { PassengerDetailsComponent } from './pages/passenger-details/passenger-details';
import { PaymentComponent } from './pages/payment/payment';
import { ConfirmationComponent } from './pages/confirmation/confirmation';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { ServicesComponent } from './pages/services/services';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AdminComponent } from './pages/admin/admin';
import { authGuard } from './services/auth-guard';
import { adminGuard } from './services/admin-guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'seat-selection/:busId', component: SeatSelectionComponent },
    { path: 'passenger-details', component: PassengerDetailsComponent },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'confirmation/:pnr', component: ConfirmationComponent, canActivate: [authGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];
