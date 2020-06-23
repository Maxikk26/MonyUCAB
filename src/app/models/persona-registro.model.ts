export class PersonaRegistro{
    
    constructor(
        public username: string,
        public register_date: string,
        public email: string,
        public direction:string,
        public phone: string,
        public identification: string,
        public user_status: number,
        public failed_attempts: number,
        public first_name: string,
        public last_name: string,
        public birthdate: string,
        public birth_country: string,
        public gender: string,
        public pw_password: string,
        public pw_status: number,
    ){

    }
}