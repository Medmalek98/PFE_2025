import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, throwError, tap } from "rxjs";
import { TokenService } from "./TokenService";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:6800/api/auth/login';
  private apiUrl = 'http://localhost:6800/api/auth';
  private usernameOrEmail: string = '';

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { usernameOrEmail, password }).pipe(
      tap(userData => {
        if (userData) {
          localStorage.setItem('accessToken', userData.accessToken);
          localStorage.setItem('refreshToken', userData.refreshToken);
          localStorage.setItem('role', userData.role);
          localStorage.setItem('userId', userData.userId);

        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken || this.tokenService.isTokenExpired(refreshToken)) {
      this.handleLogout();
      return throwError(() => 'No valid refresh token available');
    }

    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map((response: any) => {
        if (response.accessToken) {
          this.storeTokens(response.accessToken, response.refreshToken);
        }
        return response;
      }),
      catchError((error) => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { responseType: 'text' });
  }

  setUsernameOrEmail(usernameOrEmail: string): void {
    localStorage.setItem('userEmail', usernameOrEmail);
    this.usernameOrEmail = usernameOrEmail;
  }

  getUsernameOrEmail(): string {
    return this.usernameOrEmail || localStorage.getItem('userEmail') || '';
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  }
  

  handleLogout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this.router.navigate(['/authentication']);
  }



}
