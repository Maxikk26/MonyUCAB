import {Component, OnInit, Pipe} from '@angular/core';
import { ReportsService } from 'src/app/services/service.index';
import { NgForm } from '@angular/forms';
import { DatePipe} from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [],
  providers: [DatePipe]
})
export class AdminComponent implements OnInit {
  reporte1:any;
  reporte2_1: any;
  reporte2_2: any;
  reporte5:any;
  reporte5_2:any;
  id_ac: number;
  ocultarR5_1: boolean = false;
  ocultarR5_2: boolean = false;

  constructor(
    private _reportsService: ReportsService,
    private datePipe: DatePipe,
  ){ }

  ngOnInit() {
    this._reportsService.getRerport1().subscribe(res=>{
      this.reporte1 = res;
    });

    this._reportsService.getReport2_1().subscribe(response => {
      this.reporte2_1 = response;
    });

    this._reportsService.getReport2_2().subscribe(response => {
      this.reporte2_2 = response;
    });
  }

  solicitarReporte5_1(form: NgForm){
    if(form.invalid){
      return;
    }
    else{
      
      let fechaI = this.datePipe.transform(form.value.fechaI,'yyyy-MM-dd');
      let fechaF = this.datePipe.transform(form.value.fechaF,'yyyy-MM-dd');
     let aux = '{"fechaI":"'+fechaI+'","fechaF":"'+fechaF+'"}';
      let json = JSON.parse(aux);
      this._reportsService.postReport5_1(json).subscribe(res=>{
        if(res[0]!=null){
          console.log(res);
          this.reporte5 = res;
          this.ocultarR5_1 = true;
        }
        else
          this.mostrarValidacion("Error","No existen registros para esta cuenta","error","OK");
          
      },(error:HttpErrorResponse)=>{
        this.mostrarValidacion("Error","No existen registros para esta cuenta","error","OK");
      });
    }
  }

  solicitarReporte5_2(form: NgForm){
    if(form.invalid){
      return;
    }
    let id_ac = form.value.id_ac;
    let fechaI = this.datePipe.transform(form.value.fechaI,'yyyy-MM-dd');
    let fechaF = this.datePipe.transform(form.value.fechaF,'yyyy-MM-dd');
    let aux = '{"id_ac":'+id_ac+',"fechaI":"'+fechaI+'","fechaF":"'+fechaF+'"}';    
    let json = JSON.parse(aux);

    this._reportsService.postReport5_2(json).subscribe(res=>{
      if(res[0]!=null){
        console.log(res);
        
        this.ocultarR5_2 = true;
        this.reporte5_2 = res;
      }
      else
        this.mostrarValidacion("Error","No existen registros para esta cuenta","error","OK");
      
    },(error:HttpErrorResponse)=>{
      this.mostrarValidacion("Error","No existen registros para esta cuenta","error","OK");
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
