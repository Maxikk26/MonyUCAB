import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RechargeService } from 'src/app/services/service.index';

declare var paypal;

@Component({
  selector: 'app-externalrecharge',
  templateUrl: './externalrecharge.component.html',
  styles: []
})
export class ExternalrechargeComponent implements OnInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  paidPal = false;

  constructor(
    public _rechargeService: RechargeService
  ) { }

  ngOnInit() {
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
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);      
  }

}
