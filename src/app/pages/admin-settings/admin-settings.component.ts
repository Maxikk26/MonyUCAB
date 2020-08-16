import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AccountService } from 'src/app/services/service.index';
import  Swal  from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styles: []
})
export class AdminSettingsComponent implements OnInit {
  parametros: FormGroup;
  formAux2: FormGroup;

  constructor(public _accountService: AccountService,) { }

  ngOnInit() {

    //Forms

    this.parametros =  new FormGroup({
      cantidad: new FormControl(null, Validators.required),
      monto: new FormControl(null, Validators.required),
      limite: new FormControl(null, Validators.required)
    });
    let idAccount = localStorage.getItem('idAccount');
    this._accountService.getParameters(idAccount).subscribe((resp:any)=>{
      this.setParametros(resp);
    });
    
  }
  setParametros(json:any){
    this.formAux2 = new FormGroup({
      cantidad: new FormControl(null),
      monto: new FormControl(null),
      limite: new FormControl(null)
    });
    for(let i = 0; i < json.length; i++){
      //console.log(json[i]);
      let name = json[i].parameter_name;
      let value = json[i].parameter_value;
      switch(name){
        case 'Cantidad de Transacciones':
          this.parametros.patchValue({cantidad:value});
          this.formAux2.patchValue({cantidad:value});
          break;
        case 'Monto diario':
          this.parametros.patchValue({monto:value});
          this.formAux2.patchValue({monto:value});
          break;
        case 'Limite por transaccion':
          this.parametros.patchValue({limite:value});
          this.formAux2.patchValue({limite:value});
          break;
      }
    }
  }
  
  configurarParametros(){
    this.validarForms(this.parametros,this.formAux2,true);
  }

  // Returns true if the user has changed the value in the form
  isDifferent(value1: string, value2: string) {
    return value1 !== value2;
  }

  mostrarValidacion(titulo,texto,icono,confimacion){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: confimacion
    });
  }

  validarForms(form1: FormGroup, formAux:FormGroup,parametros:boolean){
    let arreglo = [];
    let json1 = [];
    let json2 = [];
    for(let key in form1.controls){
      if(this.isDifferent(form1.controls[key].value,formAux.controls[key].value))
        arreglo.push(key);
    }
    if(parametros){
      this._accountService.getUsers().subscribe((resp:any)=>{
        for (let user of resp){
          //Se cambia los parametros a los admin de manera que todos tengan los mismos valores.
          if (user.fk_rol == 1){
            json1 = this._accountService.crearJsonParametros(arreglo,form1,user.fk_account,json1);
            this.jsonPutPopper(json1);
          //A los usuarios se le hace una comprobacion
          }else{
            this._accountService.getParameters(user.fk_account).subscribe((data:any)=>{
              for (let param of data){
                for(let x of arreglo){
                  if(x == 'cantidad' && param.parameter_name == 'Cantidad de Transacciones' && param.parameter_value > form1.controls[x].value)
                    json2 = this._accountService.crearJsonParametros(arreglo,form1,user.fk_account,json2);
                  else if(x == 'monto' && param.parameter_name == 'Monto diario' && param.parameter_value > form1.controls[x].value)
                    json2 = this._accountService.crearJsonParametros(arreglo,form1,user.fk_account,json2);
                  else if(x == 'limite' && param.parameter_name == 'Limite por transaccion' && param.parameter_value > form1.controls[x].value)
                    json2 = this._accountService.crearJsonParametros(arreglo,form1,user.fk_account,json2);
                  this.jsonPutPopper(json2);
                }
              }
            });
          }
        }
      });
      this.mostrarValidacion('¡Modificación exitosa!','Los parámetros han sido modificados exitosamente.','success','Ok');
      return;
    }
  }

  jsonPutPopper(json: any[]){
    for(let i = 0;i < json.length;i++){
      this._accountService.putParameters(json[i]).subscribe((resp:any)=>{
      },(error:HttpErrorResponse)=>{
        this.mostrarValidacion('Error','Se ha producido un error inesperado.','error','Ok');
      });
    }
    json.pop();
  }
}
