import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error("Invalid token structure");
        return null;
      }
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    return Date.now() >= expirationDate;
  }
}
