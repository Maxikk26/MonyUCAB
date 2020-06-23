export class Account{
    
    constructor(
        public id_account: number,
        public account_number: string,
        public balance: number,
        public fk_user_mu: number
        ){

    }
}