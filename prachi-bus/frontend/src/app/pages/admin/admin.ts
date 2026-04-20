import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';
import { AuthService } from '../../services/auth';

type Tab = 'dashboard' | 'buses' | 'bookings' | 'users' | 'messages';

@Component({
  selector: 'pb-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  svc = inject(AdminService);
  auth = inject(AuthService);

  tab = signal<Tab>('dashboard');
  loading = signal(false);
  saving = signal(false);

  stats = signal<any>(null);
  buses = signal<any[]>([]);
  bookings = signal<any[]>([]);
  users = signal<any[]>([]);
  messages = signal<any[]>([]);

  // modal state
  modal = signal<'bus' | 'user' | null>(null);
  editTarget = signal<any>(null);

  busForm = signal<any>(this.freshBus());
  userForm = signal<any>(this.freshUser());

  // confirm dialog
  confirmText = signal('');
  confirmFn = signal<(() => Promise<void>) | null>(null);

  // toast
  toast = signal<{ msg: string; ok: boolean } | null>(null);

  freshBus() {
    return { name: '', type: 'AC', source: '', destination: '', departureTime: '', arrivalTime: '', duration: '', fare: 0, totalSeats: 40 };
  }
  freshUser() {
    return { name: '', email: '', password: '', phone: '', role: 'user' };
  }

  async ngOnInit() { await this.load('dashboard'); }

  async switchTab(t: Tab) {
    this.tab.set(t);
    await this.load(t);
  }

  async load(t: string) {
    this.loading.set(true);
    try {
      if (t === 'dashboard') this.stats.set(await this.svc.getStats());
      else if (t === 'buses') this.buses.set(await this.svc.getBuses());
      else if (t === 'bookings') this.bookings.set(await this.svc.getBookings());
      else if (t === 'users') this.users.set(await this.svc.getUsers());
      else if (t === 'messages') this.messages.set(await this.svc.getMessages());
    } catch { this.notify('Failed to load data', false); }
    finally { this.loading.set(false); }
  }

  // ── Bus ──────────────────────────────────────────────────
  openBusModal(bus?: any) {
    this.editTarget.set(bus || null);
    this.busForm.set(bus ? { ...bus } : this.freshBus());
    this.modal.set('bus');
  }

  setBusField(k: string, v: any) { this.busForm.update(f => ({ ...f, [k]: v })); }

  async saveBus() {
    this.saving.set(true);
    try {
      if (this.editTarget()) {
        const updated = await this.svc.updateBus(this.editTarget()._id, this.busForm());
        this.buses.update(list => list.map(b => b._id === updated._id ? updated : b));
        this.notify('Bus updated', true);
      } else {
        const created = await this.svc.createBus(this.busForm());
        this.buses.update(list => [created, ...list]);
        this.notify('Bus added', true);
      }
      this.modal.set(null);
    } catch (e: any) { this.notify(e.error?.message || 'Save failed', false); }
    finally { this.saving.set(false); }
  }

  askDeleteBus(id: string) {
    this.confirmText.set('Delete this bus? All related data stays but the bus will be removed.');
    this.confirmFn.set(async () => {
      await this.svc.deleteBus(id);
      this.buses.update(list => list.filter(b => b._id !== id));
      this.notify('Bus deleted', true);
    });
  }

  // ── Booking ──────────────────────────────────────────────
  async setStatus(id: string, status: string) {
    try {
      const updated = await this.svc.setBookingStatus(id, status);
      this.bookings.update(list => list.map(b => b._id === id ? { ...b, status: updated.status } : b));
      this.notify(`Booking ${status.toLowerCase()}`, true);
    } catch { this.notify('Update failed', false); }
  }

  askDeleteBooking(id: string) {
    this.confirmText.set('Permanently delete this booking? Seats will be freed.');
    this.confirmFn.set(async () => {
      await this.svc.deleteBooking(id);
      this.bookings.update(list => list.filter(b => b._id !== id));
      this.notify('Booking deleted', true);
    });
  }

  // ── User ─────────────────────────────────────────────────
  openUserModal(user?: any) {
    this.editTarget.set(user || null);
    this.userForm.set(user ? { name: user.name, email: user.email, phone: user.phone || '', role: user.role, password: '' } : this.freshUser());
    this.modal.set('user');
  }

  setUserField(k: string, v: any) { this.userForm.update(f => ({ ...f, [k]: v })); }

  async saveUser() {
    this.saving.set(true);
    try {
      if (this.editTarget()) {
        const payload: any = { name: this.userForm().name, email: this.userForm().email, phone: this.userForm().phone, role: this.userForm().role };
        const updated = await this.svc.updateUser(this.editTarget()._id, payload);
        this.users.update(list => list.map(u => u._id === updated._id ? updated : u));
        this.notify('User updated', true);
      } else {
        const created = await this.svc.createUser(this.userForm());
        this.users.update(list => [created, ...list]);
        this.notify('User created', true);
      }
      this.modal.set(null);
    } catch (e: any) { this.notify(e.error?.message || 'Save failed', false); }
    finally { this.saving.set(false); }
  }

  askDeleteUser(id: string) {
    this.confirmText.set('Delete this user? Their bookings will also be removed.');
    this.confirmFn.set(async () => {
      await this.svc.deleteUser(id);
      this.users.update(list => list.filter(u => u._id !== id));
      this.notify('User deleted', true);
    });
  }

  // ── Messages ─────────────────────────────────────────────
  async markRead(id: string) {
    await this.svc.markMessageRead(id);
    this.messages.update(list => list.map(m => m._id === id ? { ...m, read: true } : m));
  }

  askDeleteMessage(id: string) {
    this.confirmText.set('Delete this message permanently?');
    this.confirmFn.set(async () => {
      await this.svc.deleteMessage(id);
      this.messages.update(list => list.filter(m => m._id !== id));
      this.notify('Message deleted', true);
    });
  }

  unreadCount() {
    return this.messages().filter(m => !m.read).length;
  }

  // ── Confirm / Toast ──────────────────────────────────────
  async runConfirm() {
    const fn = this.confirmFn();
    this.confirmFn.set(null);
    if (fn) { try { await fn(); } catch { this.notify('Action failed', false); } }
  }

  notify(msg: string, ok: boolean) {
    this.toast.set({ msg, ok });
    setTimeout(() => this.toast.set(null), 3000);
  }

  statusBadge(s: string) {
    return s === 'Booked' ? 'bg-green-100 text-green-700' : s === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700';
  }

  logout() { this.auth.logout(); }
}
