import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class VentesController {
  private baseUrl!: string;

  constructor() {}

  getBaseUrl(): string {
    if (!this.baseUrl) {
      throw new Error('Base URL is not set. Please select a Société first.');
    }
    return this.baseUrl;
  }
  
  
}
