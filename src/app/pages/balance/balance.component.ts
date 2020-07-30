import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/service.index';
import { DatePipe } from '@angular/common';
import { Account } from './../../models/account.model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styles: [],
  providers: [DatePipe]
})
export class BalanceComponent implements OnInit {

  cuenta: Account
  date: Date;
  currentMonth:string;
  natural: boolean;
  recharges: any[] = [];
  allRecharges: any[] = [];

  constructor(
    public _accountService: AccountService,
    private datePipe: DatePipe
    ) 
    { 
      this.date = new Date();
      this.currentMonth = this.datePipe.transform(this.date,'MM');
    }

  ngOnInit() {
    let id = localStorage.getItem('id');
    let idAccount = localStorage.getItem('idAccount');
    let rol = localStorage.getItem('rol');
    this._accountService.getAccount(id).subscribe((resp: Account)=>{
      this.cuenta = resp;
    });
    if(rol === 'natural'){
      this.natural = true;
      this._accountService.getRecharges().subscribe((resp:any[])=>{        
        for(let i = 0; i < resp.length; i++){
          let obj = resp[i];
          if(obj.fk_account == Number(idAccount)){
            let month = this.datePipe.transform(obj.recharge_date,'MM');
            let str = '{"amount":'+obj.amount+',"date":"'+obj.recharge_date+'","reference":"'+obj.reference+'","type_recharge":"'+obj.type_recharge+'"}';
            if(this.currentMonth === month){
              this.recharges.push(JSON.parse(str));
            }
            this.allRecharges.push(JSON.parse(str));
          }
        }
      });
    }
    else{
      this.natural = false;
    }
  }

}
