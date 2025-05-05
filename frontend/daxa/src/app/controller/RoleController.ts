import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Role } from "../model/role";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class RoleController {

    private baseUrl = "http://localhost:6800/role";

    constructor(private http: HttpClient) {}  

    getRole() : Observable <[Role]> { 
        return this.http.get<[Role]>(`${this.baseUrl}/get`);
      }
}