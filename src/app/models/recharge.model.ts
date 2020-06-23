export class Recharge{
    
    constructor(
        public recharge_date: string,
        public amount: number,
        public id_account: number,
        public bank_name: string,
        public card_number: string,
        public card_name: string,
        public expiration_date: string,
        public card_brand: string,
        public secret_code: string,
        public c_description: string
    ){

    }
}