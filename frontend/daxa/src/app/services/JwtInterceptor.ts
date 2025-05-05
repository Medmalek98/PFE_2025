import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "./AuthService";
import { TokenService } from "./TokenService";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(private authService: AuthService, private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.authService.refreshToken().pipe(
            switchMap((newTokens: any) => {
              this.isRefreshing = false;

              localStorage.setItem('accessToken', newTokens.accessToken);
              localStorage.setItem('refreshToken', newTokens.refreshToken);

              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` }
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError) => {
              this.isRefreshing = false;
              this.authService.handleLogout();
              return throwError(() => refreshError);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
