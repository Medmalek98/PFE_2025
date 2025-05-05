export class Societe {
    id?: number;
    societeName: string;
    matriculeFiscal: string;
    debutContract: string;
    finContract: string;
    ipadresse: string;
    nomContact: string;
    numContact: string;

    constructor(
        id: number | undefined,
        societeName: string,
        matriculeFiscal: string,
        debutContract: string,
        finContract: string,
        ipadresse: string,
        nomContact: string,
        numContact: string,
    ) {
        this.id = id;
        this.societeName = societeName;
        this.matriculeFiscal = matriculeFiscal;
        this.debutContract = debutContract;
        this.finContract = finContract;
        this.ipadresse = ipadresse;
        this.nomContact = nomContact;
        this.numContact = numContact;

    }



    
}