export class ComercioRegistro{
    
    constructor(
        public username: string,
        public register_date: string,
        public email: string,
        public direction: string,
        public phone: string,
        public identification: string,
        public user_status: number,
        public failed_attempts: number,
        public commerce_name: string,
        public country: string,
        public contact_name: string,
        public contact_celphone: string,
        public pw_password: string,
        public pw_date: string,
        public pw_status: number,
        ){

    }
}