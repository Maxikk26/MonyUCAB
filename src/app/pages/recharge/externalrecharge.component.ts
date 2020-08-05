import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RechargeService } from 'src/app/services/service.index';
import { Recharge } from 'src/app/models/recharge.model';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import  Swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { AccountService } from './../../services/account/account.service';

declare var paypal;
declare var StripeCheckout;


@Component({
  selector: 'app-externalrecharge',
  templateUrl: './externalrecharge.component.html',
  styleUrls: ['./externalrecharge.component.css'],
  providers: [DatePipe]
})
export class ExternalrechargeComponent implements OnInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  handler;
  confirmation: any;
  loading = false;
  paidPal = false;
  recarga: Recharge;
  date: Date;
  currentDate: string;
  stripeRecharge:any;
  account:any;
  

  constructor(
    public _rechargeService: RechargeService,
    private datePipe: DatePipe,
    private router: Router,
    public _accountService: AccountService
  ) 
  { 
    this.date = new Date();
    this.currentDate = this.datePipe.transform(this.date,'yyyy-MM-dd');
    
  }

  ngOnInit() {
    this.stripeRecharge = this._rechargeService.stripeVacio();   
    let idAccount = localStorage.getItem('idAccount');
    this._accountService.getAccount(idAccount).subscribe((res:any)=>{
      this.stripeRecharge.fk_account_receive = res.account_number;
    });
    this.recarga = this._rechargeService.recargaVacia();
    paypal
      .Buttons({
        createOrder:(data,actions)=>{
          return actions.order.create({
            purchase_units:[
              {
                description: 'Recarga con Paypal',
                amount:{
                  currency_code: 'USD',
                  value: this._rechargeService.montoExterno
                }
              }
            ]
          });
        },
        onApprove: async (data,actions)=>{
          const order = await actions.order.capture();
          this.paidPal = true;
          console.log(order);
          console.log(order.purchase_units[0].amount.value);
          let idAccount = Number(localStorage.getItem('idAccount'));
          this.recarga.recharge_date = this.currentDate;
          this.recarga.expiration_date = this.currentDate;
          this.recarga.amount = order.purchase_units[0].amount.value;
          this.recarga.type_recharge = "Paypal";
          this.recarga.id_account = idAccount;
          console.log(this.recarga);
          this._rechargeService.recargarSaldo(this.recarga).subscribe(resp=>{
            //console.log(resp);
            this.mostrarValidacion("Recarga Exitosa","Recarga realizada exitosamente","success","Ok");
            this.router.navigate(['/balance']);
          },(error:HttpErrorResponse)=>{
            //console.log(error);
            this.mostrarValidacion("Error","Error del sistema","error","Ok");
            this.router.navigate(['/balance']);
          });
        },
        onError: err => {
          //console.log(err);
          this.mostrarValidacion("Error","Error conectando con Paypal","error","Ok");
          this.router.navigate(['/balance']);
        }
      })
      .render(this.paypalElement.nativeElement); 
      
      this.handler = StripeCheckout.configure({
        key: 'pk_test_51H9DobCwcmgMmAo0CkSDi3Vc6zDhHMqR314eie67Ouu9FyLdxpMCrYOyJ7V5h8I3oK7PebQdjBtvIpBoJ9daX13m00Va2QSn6X',
        locale: 'auto',
        source: async (source) => {
          this.loading = true;
          console.log(source);
          let idAccount = localStorage.getItem('idAccount');
          this.stripeRecharge.token = source.id;
          this.stripeRecharge.amount = this._rechargeService.montoExterno*100;
          this.stripeRecharge.fecha_stripe = this.currentDate;
          this.stripeRecharge.fk_account_send = Number(idAccount);
          console.log(this.stripeRecharge);
          this.loading = false;
          this.sendStripe();
        }
      });
  }


  async checkout(e) {
    this.handler.open({
      name: 'Recarga MonyUCAB',
      amount: this._rechargeService.montoExterno,
    });
    e.preventDefault();
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

  sendStripe(){
    this._rechargeService.postStripe(this.stripeRecharge).subscribe(res=>{
      this.mostrarValidacion('Exito','Recarga exitosa!','success','Ok');
      this.router.navigate(['/balance']);
    },(error:HttpErrorResponse)=>{
      this.mostrarValidacion('Error','Error al reacargar con Stripe, intente de nuevo','error','Ok');
      this.router.navigate(['/balance']);
    });
    
  }

  mostrarValidacion(titulo,texto,icono,confimacion){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: confimacion
    });
  }


}
