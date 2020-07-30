export class Comercio{

    constructor(
        public id_commerce: number,
        public commerce_name: string,
        public country: string,
        public contact_name: string,
        public contact_celphone: string,
        public commission: number,
        public fk_user_mu: number
    ){

    }
}
