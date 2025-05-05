//import { Societe } from '../Model/Societe';

export class User {
    id?: number;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: Array<{ name: string }>;
    //societes: Societe[]; 

    constructor(id: number, name: string, username: string, email: string, password: string, roles: Array<{ name: string }> ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
      //  this.societes = societes;
    }
}
