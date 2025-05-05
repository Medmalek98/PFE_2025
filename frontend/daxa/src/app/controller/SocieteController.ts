import { HttpClient , HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Societe } from "../model/societe";
import { User } from "../model/user";

@Injectable({
    providedIn: 'root'
})
export class SocieteController {
    private baseUrl = "http://localhost:6800/Societe";   
   
    constructor(private http: HttpClient) {}      

    getTotalCompany(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.baseUrl}/get`);    }

    addCompany(societe: Societe): Observable<Societe> {
        return this.http.post<Societe>(`${this.baseUrl}/add`, societe);
    }
    
    deleteSociete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }

    updateSociete(societe: Societe): Observable<Societe> {
        return this.http.put<Societe>(`${this.baseUrl}/update/${societe.id}`, societe);
    }

    assignUsersToSociete(societeId: number, userIds: number[]): Observable<Societe> {
        return this.http.post<Societe>(
            `${this.baseUrl}/${societeId}/assign-users`, userIds);
    }

    getUsersBySociete(societeId: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/${societeId}/users`);
    }

    removeUserFromSociete(societeId: number, userId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/${societeId}/users/${userId}`
        );
    }
}