export class Persona{
    
    constructor(
        public id_person: number,
        public first_name: string,
        public last_name: string,
        public birthdate: string,
        public birth_country: string,
        public gender: string,
        public fk_user_mu: number
    ){

    }
}