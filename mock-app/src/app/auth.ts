import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000/api';

export interface AuthResponse {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private loggedInEmail: string | null = null;

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/register`, {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/login`, {
      email,
      password,
    });
  }

  setLoggedInUser(email: string): void {
    this.loggedInEmail = email;
  }

  getLoggedInUser(): string | null {
    return this.loggedInEmail;
  }

  logout(): void {
    this.loggedInEmail = null;
  }
}
