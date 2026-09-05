import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  errorMessage = signal('');

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setLoggedInUser(res.email);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage.set('Invalid email or password.');
      },
    });
  }
}
