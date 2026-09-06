import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  email = '';
  password = '';
  errorMessage = signal('');

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.error || 'Registration failed.');
      },
    });
  }
}
