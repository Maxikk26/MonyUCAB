import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RechargeService } from 'src/app/services/service.index';


declare var paypal;

@Component({
  selector: 'app-outsiderecharge',
  templateUrl: './outsiderecharge.component.html',
  styles: []
})

export class OutsiderechargeComponent implements OnInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  next = false;
  paidPal = false;
  form: FormGroup;
  saldo:number = 0;

  constructor(
    private router:Router,
    public _rechargeService: RechargeService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      monto: new FormControl(null, Validators.required)
    },{validators: this.montoValido('monto')});

    this.form.patchValue({
      monto: '0'
    })
  }

  recargarSaldo(){
    this._rechargeService.montoExterno = this.form.value.monto;
    this.router.navigate(['/externalrecharge']);
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

}
