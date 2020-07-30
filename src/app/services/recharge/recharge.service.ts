import { Injectable } from '@angular/core';
import { Recharge } from 'src/app/models/recharge.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Bank } from 'src/app/models/bank.model';
import { Card } from 'src/app/models/card.model';



@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  card: Card[]=[{
    id_card: 0,
    card_number: '',
    expiration_date: '',
    card_name: '',
    card_brand: '',
    secret_code: '',
    fk_card_type: 0,
    fk_bank: 0,
    id: 0,
  }];
  recharge: Recharge[] = [{
    recharge_date: '',
    amount: 0,
    type_recharge: "",
    id_account: 0,
    bank_name: '',
    card_number: '',
    card_name: '',
    expiration_date: '',
    card_brand: '',
    secret_code: '',
    c_description: ''
  }];
  banco: Bank[]=[{
    id_bank: 0,
    bank_name: '',
    bank_status: 0
  }];
  stripe = [
    {
    token: "",
    fecha_stripe: "",
    type: "Recharge",
    amount: 0,
    description: "Recarga por Stripe", 
    fk_account_send: 0,
    fk_account_receive: "",
    expiration_date: "2025-07-06",
  }];
  montoExterno:number = 0;
 

  constructor
  (
    public http: HttpClient
  ) {
    
   }

  recargaVacia(){
    return this.recharge[0];
  }

  bancoVacio(){
    return this.banco;
  }

  tarjetaVacia(){
    return this.card;
  }

  stripeVacio(){
    return this.stripe[0];
  }
  recargarSaldo(recarga: Recharge){
    let url = URL_SERVICIOS + '/recharges';
    return this.http.post(url,recarga);
  }

  getBanks(){
    let url = URL_SERVICIOS + '/banks';
    return this.http.get(url);
  }

  getCards(id){
    let url = URL_SERVICIOS + '/cards/'+id;
    return this.http.get(url);
  }

  postStripe(json){
    let url = URL_SERVICIOS + '/stripe';
    return this.http.post(url,json);
  }

}
