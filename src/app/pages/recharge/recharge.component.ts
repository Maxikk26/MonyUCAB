import { Component, OnInit } from '@angular/core';
import { RechargeService, AccountService } from 'src/app/services/service.index';
import { Account } from '../../models/account.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Recharge } from 'src/app/models/recharge.model';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Bank } from 'src/app/models/bank.model';
import { Card } from 'src/app/models/card.model';


@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styles: [],
  providers: [DatePipe]
})
export class RechargeComponent implements OnInit {

  form: FormGroup;
  monto: number = 0;
  tipo: boolean = true;
  cuenta: Account;
  recarga: Recharge;
  recargas: Recharge[];
  banco: Bank[];
  tarjeta: Card[];
  date: Date;
  currentDate: string;
  newCard: boolean = true;
  paidPal = false;


  constructor(
    public _rechargeService: RechargeService,
    public _accountService: AccountService,
    private datePipe: DatePipe,
    public router: Router
  ) {
    this.date = new Date();
    this.currentDate = this.datePipe.transform(this.date,'yyyy-MM-dd');
    
    }

  ngOnInit() {

    this.recarga = this._rechargeService.recargaVacia();
    this.banco = this._rechargeService.bancoVacio();
    this.tarjeta = this._rechargeService.tarjetaVacia();
    this.form = new FormGroup({
      monto: new FormControl(null, [Validators.required,Validators.pattern('[0-9]*\.?[0-9]*')]),
      nombre: new FormControl(null, Validators.required),
      tipo: new FormControl(null, Validators.required),
      numeroTarjeta: new FormControl(null, Validators.required),
      banco: new FormControl(null, Validators.required),
      mes: new FormControl(null, Validators.required),
      año: new FormControl(null, Validators.required),
      marca: new FormControl(null, Validators.required),
      cvc: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
      tarjetaEx: new FormControl(null)
    }, {validators: this.montoValido('monto')} );
    this._rechargeService.getBanks().subscribe((resp:Bank[])=>{
      this.banco = resp;
      /* console.log(this.banco); */
    });
    let id = localStorage.getItem('id');
    this._accountService.getAccount(id).subscribe((resp:Account)=>{
      localStorage.setItem('idAccount',resp.id_account.toString());
    });
    let idAccount = localStorage.getItem('idAccount');
    console.log(idAccount);
    
    this._rechargeService.getCards(idAccount).subscribe((resp:Card[])=>{
      this.tarjeta = resp;
      console.log(this.tarjeta);
    });
  }

  onChange(deviceValue) {
   
    
    for(let i of this.tarjeta){
      if(i.card_number === deviceValue){
        for(let bank of this.banco){
          if(bank.id_bank === i.fk_bank)
          this.form.patchValue({
            banco: bank.bank_name
          });
        }
        let year = this.datePipe.transform(i.expiration_date,'yyyy');
        let month = this.datePipe.transform(i.expiration_date,'MM');
        if(i.secret_code === '000')
          this.form.patchValue({
            tipo: 'Debito'
          });
        else
          this.form.patchValue({
            tipo: 'Credito'
          });
        this.form.patchValue({
          nombre: i.card_name,
          numeroTarjeta: i.card_number,
          marca: i.card_brand,
          mes: month,
          año: year,
          cvc:i.secret_code
        });
      }
    }
}

  recargaExterna(){
    this.router.navigate(['/outsiderecharge']);
  }

  montoValido(campo:string){
    return (group: FormGroup)=>{
      let valor = group.controls[campo].value;
      if(valor > 0 && valor !== null){
        return null;
      }
      return {
        montoValido:true
      };
    };
  }

  toggle(event){
    let selected = event.target.value;
    if (selected == "Credito") {
      this.tipo = true;
    } else {
      this.tipo = false;
    }
  }

  mostrarValidacion(titulo,texto,icono,confimacion){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: confimacion
    });
  }

  recargarSaldo(){
    console.log(this.form.value);
    let id = localStorage.getItem('id');  
    
    this._accountService.getAccount(id).subscribe((resp:Account)=>{
      console.log(resp.id_account);
      console.log('dia '+this.currentDate);
      
      this.cuenta = resp;
      this.recarga.recharge_date = this.currentDate;
      this.recarga.amount = this.form.controls['monto'].value;
      this.recarga.id_account = this.cuenta.id_account;
      this.recarga.bank_name = this.form.controls['banco'].value;
      this.recarga.card_number = this.form.controls['numeroTarjeta'].value;
      this.recarga.card_name = this.form.controls['nombre'].value;
      this.recarga.expiration_date = this.form.controls['año'].value +'-01-' + this.form.controls['mes'].value;
      if(this.form.controls['tipo'].value === 'Credito'){
        this.recarga.card_brand = this.form.controls['marca'].value;
        this.recarga.secret_code = this.form.controls['cvc'].value;
      }
      else{
        this.recarga.card_brand = 'Visa';
        this.recarga.secret_code = '000';
      }
      this.recarga.c_description = this.form.controls['tipo'].value;
      console.log(this.recarga);
      
      this._rechargeService.recargarSaldo(this.recarga).subscribe((resp)=>{
        this.mostrarValidacion('¡Recarga Exitosa!','Se ha recargado su saldo','success','Ok');
        this.router.navigate(['/dashboard']);
      },(error:HttpErrorResponse)=>{
        this.mostrarValidacion('Error','Error al realizar la recarga','error','Ok');
        this.router.navigate(['/dashboard']);
      });
    }, (erro: HttpErrorResponse)=>{
      this.mostrarValidacion('Error','Ha ocurrido un error muy extraño, no existe la cuenta','error','Ok');
      this.router.navigate(['/dashboard']);
    });
  }

}
