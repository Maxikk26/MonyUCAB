import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/service.index';
import { Account } from './../../models/account.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  cuenta: Account;
  id: string;
  idAccount: string;
  natural: boolean;
  operations=[];
  allOperations=[];
  refunds =[];
  date: Date;
  currentMonth:string;

  constructor(
    public _accountService: AccountService,
    private datePipe: DatePipe,
    ) 
    { 
      this.date = new Date();
      this.currentMonth = this.datePipe.transform(this.date,'MM');
            
    }

  ngOnInit() {
    this.cuenta = this._accountService.vacio();
    this.id = localStorage.getItem('id');
    this.idAccount = localStorage.getItem('idAccount');
    let persona = localStorage.getItem('rol');
    setTimeout(()=>{
      this.idAccount = localStorage.getItem('idAccount');
      this._accountService.getOperations(this.idAccount).subscribe((resp:any)=>{
        this.operations = resp;
        this.allOperations = resp;
        this._accountService.getAccounts().subscribe((resp:any)=>{
          for(let i = 0; i < resp.length;i++){
            let obj = resp[i];
            for(let j = 0; j < this.operations.length; j++){
              let obj1 = this.operations[j];  
              let month = this.datePipe.transform(obj1.date_operation,'MM');
              if(this.currentMonth != month){
                this.operations.splice(j,1); 
              }
              if(obj.id_account == obj1.fk_account_receive){
                this.operations[j].account_number = obj.account_number;
              }
            }
          }
        });
        this._accountService.getRefunds().subscribe((resp:any)=>{
          for(let i = 0; i < resp.length; i++){
            let obj = resp[i];
            for(let j = 0; j < this.allOperations.length; j++){
              let obj1 = this.allOperations[j];
              if(obj.fk_operation == obj1.id_operation){
                let str = `{"amount":${obj1.amount},"status":"${obj1.op_status}","reference":"${obj1.reference}","info":"${obj1.info}"}`;
                this.refunds.push(JSON.parse(str));                
              }
            }
          }

        }); 
      },(error:HttpErrorResponse)=>{      
      });
    },1000);
    if(persona === 'natural'){
      this.natural = true;
    }
    else
      this.natural = false;
    this._accountService.getAccount(this.id).subscribe((resp: Account)=>{
      this.cuenta = resp;
    });
       
  }

}
