import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styles: [],
  providers: [DatePipe]
})
export class WithdrawComponent implements OnInit {
  monto:number
  total: boolean = false;
  retiro:any;
  date: Date;
  currentDate: string;

  constructor(
    public _accountService: AccountService,
    private datePipe: DatePipe
  ) {

    this.date = new Date();
        this.currentDate = this.datePipe.transform(this.date,'yyyy-MM-dd');
   }

  ngOnInit() {
    this.retiro = this._accountService.retiroBase();
  }

  retirar(form: NgForm){
    if(form.invalid){
      return;
    }
    else{
      let idAccount = localStorage.getItem('idAccount');
      this._accountService.getAccount(idAccount).subscribe((res:any)=>{
        console.log(res);        
        if(form.value.Total){
          console.log('total');
          this.retiro.amount = res.balance;
          this.retiro.withdrawal_date = this.currentDate;
          this.retiro.reference = "Total";
          this.retiro.account_number = res.account_number;
          let idAccount = localStorage.getItem('idAccount');
          this.retiro.fk_account = Number(idAccount);
          console.log(this.retiro);
          this._accountService.postRetiro(this.retiro).subscribe(res=>{
            console.log(res);
            
          },(error:HttpErrorResponse)=>{
            console.log(error);
            
          });
          
        }
        else if(form.value.monto > res.balance){
          this.mostrarValidacion('Error','El monto excede la cantidad del balance','error','Ok');
        }
        else{
          this.retiro.amount = form.value.monto;
          this.retiro.withdrawal_date = this.currentDate;
          this.retiro.reference = "Parcial";
          this.retiro.account_number = res.account_number;
          let idAccount = localStorage.getItem('idAccount');
          this.retiro.fk_account = Number(idAccount);
          console.log(this.retiro);
          this._accountService.postRetiro(this.retiro).subscribe(res=>{
            console.log(res);
            
          },(error:HttpErrorResponse)=>{
            console.log(error);
            
          });
        }
      })
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

}
