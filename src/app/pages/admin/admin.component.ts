import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/service.index';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [],
  providers: [DatePipe]
})
export class AdminComponent implements OnInit {
  reporte1:any;
  reporte5:any;

  constructor(
    private _reportsService: ReportsService,
    private datePipe: DatePipe,
  ){ }

  ngOnInit() {
    this._reportsService.getRerport1().subscribe(res=>{
      this.reporte1 = res;
    });
  }

  solicitar(form: NgForm){
    if(form.invalid){
      return;
    }
    let fechaI = this.datePipe.transform(form.value.fechaI,'yyyy-MM-dd');
    let fechaF = this.datePipe.transform(form.value.fechaF,'yyyy-MM-dd');
    //let aux = '{"fechaI":"'+fechaI+'","fechaF":"'+fechaF+'"}';
    let aux = '{"fechaI":"2030-07-01","fechaF":"2030-07-15"}';
    let json = JSON.parse(aux);
    console.log(json);
    
    this._reportsService.postReport5_1(json).subscribe(res=>{
      this.reporte5 = res;
    });

  }

}
