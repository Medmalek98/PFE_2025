import { HttpClient ,HttpHeaders  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../model/user";
import { Societe } from "../model/societe";
import { AuthService } from "../services/AuthService";


@Injectable({
    providedIn: 'root'
})
export class UserController {
    private baseUrl = "http://localhost:6800/api/users";

    constructor(private http: HttpClient ,private authService: AuthService) {}        


    addUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/add`, user);
    
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/get`);
      }
     
    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/put/${user.id}`, user);
    }
    
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }

    getUserSocietes(userId: number): Observable<Societe[]> {
        return this.http.get<Societe[]>(`${this.baseUrl}/${userId}/societes`);
    } 

    getCurrentUserSocietes(): Observable<Societe[]> {
        const userId = this.authService.getUserId();
        if (!userId) {
          console.error("No user ID available in localStorage.");
          throw new Error("User not logged in.");
        }
        return this.getUserSocietes(Number(userId));
      }
      
}