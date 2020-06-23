export class Usuario{
    
    constructor(
        public id_user: number,
        public username: string,
        public register_date: string,
        public email: string,
        public direction: string,
        public phone: string,
        public identification: string,
        public user_status: number,
        public failed_attempts: number,
        public fk_rol: number
    ){

    }
}