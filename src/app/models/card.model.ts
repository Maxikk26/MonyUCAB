export class Card{
    constructor(
        public id_card: number,
        public card_number: string,
        public expiration_date: string,
        public card_name: string,
        public card_brand: string,
        public secret_code: string,
        public fk_card_type: number,
        public fk_bank: number,
        public id: number,
        ){

    }
}