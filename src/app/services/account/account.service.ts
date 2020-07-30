import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from './../../config/config';
import { HttpClient} from '@angular/common/http';
import { Account } from './../../models/account.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  cuenta: Account[] = [{
    id_account: 0,
    account_number: '',
    balance: 0,
    fk_user_mu: 0
  }];
  parametros: any[] = [{
    fk_account:0,
    fk_parameter:1,
    parameter_value:5
  },
  {
    fk_account:0,
    fk_parameter:2,
    parameter_value:10000
  },
  {
    fk_account:0,
    fk_parameter:3,
    parameter_value:1000
  }];


  constructor(
    public http: HttpClient) 
    { 
      
    }

  vacio(){
    return this.cuenta[0];
  }

  parametrosBase(){
    return this.parametros;
  }

  /*Peticiones GET*/
  getAccount(id:string){
    let url = URL_SERVICIOS + '/accounts/'+id;
    return  this.http.get(url);
  }

  getAccounts(){
    let url = URL_SERVICIOS + '/accounts';
    return  this.http.get(url);
  }

  getOperations(id: string){
    let url = URL_SERVICIOS + '/operations/'+id;
    return this.http.get(url);
  }

  getParameters(idAccount: string){
    let url = URL_SERVICIOS + '/ConfigurationParameters/'+idAccount;
    return this.http.get(url);
  }

  getParametersAll(){
    let url = URL_SERVICIOS + '/parameters';
    return this.http.get(url);
  }

  getRecharges(){
    let url = URL_SERVICIOS + '/recharges';
    return this.http.get(url);
  }

  getRefunds(){
    let url = URL_SERVICIOS + '/refunds';
    return this.http.get(url);
  }

  getUsers(){
    let url = URL_SERVICIOS + '/users';
    return this.http.get(url);
  }

  /*Peticiones POST*/

  postParameters(json:JSON){
    let url = URL_SERVICIOS + '/ConfigurationParameters';
    return this.http.post(url,json);
  }

  /*Peticiones PUT*/

  putParameters(json:JSON){
    let url = URL_SERVICIOS + '/ConfigurationParameters';
    return this.http.put(url,json);
  }

  /*Peticiones PATCH*/

  patchPerson(id: string, json:JSON[]){
    let url = URL_SERVICIOS + '/persons/'+id;   
    return this.http.patch(url,json);
  }

  patchComercio(id: string, json:JSON[]){
    let url = URL_SERVICIOS + '/commerces/'+id;   
    return this.http.patch(url,json);
  }

  patchUsuario(id: string, json:JSON[]){
    let url = URL_SERVICIOS + '/users/'+id;   
    return this.http.patch(url,json);
  }

  


  crearJsonComercio(arreglo:string[],formCommerce:FormGroup){
    let path = [];
    let feed;
    for(var i = 0; i < arreglo.length; i++){
      let index = arreglo[i];
      console.log(index);
      
      switch(index){
        case 'pais':
          feed = {"op":"replace","path":"/country","value":formCommerce.controls[index].value};
          path.push(feed);
          break;
        case 'nombreContacto':
          feed = {"op":"replace","path":"/contact_name","value":formCommerce.controls[index].value};
          path.push(feed);
          break;
        case 'telefono':
          feed = {"op":"replace","path":"/contact_celphone","value":formCommerce.controls[index].value};
          path.push(feed);
          break;
        case 'comision':
          feed = {"op":"replace","path":"/commission","value":formCommerce.controls[index].value};
          path.push(feed);
          break
      }
    }
    return path;
  }

  crearJsonPersona(arreglo:string[], formPerson:FormGroup){
    let path = []
    let feed;
    for(var i = 0; i < arreglo.length; i++){
      let index = arreglo[i];
      switch(index){
        case 'nombre':
          feed = {"op":"replace","path":"/first_name","value":formPerson.controls[index].value};
          path.push(feed);
          break;
        case 'apellido':
          feed = {"op":"replace","path":"/last_name","value":formPerson.controls[index].value};
          path.push(feed);
          break;
        case 'genero':
          feed = {"op":"replace","path":"/gender","value":formPerson.controls[index].value};
          path.push(feed);
          break;
      }
    }
    return path;
  }

  crearJsonUsuario(arreglo:string[],form:FormGroup){
    let path = [];
    let feed;
    for(var i = 0; i < arreglo.length; i++){
      let index = arreglo[i];
      switch(index){
        case 'correo':
          feed = {"op":"replace","path":"/email","value":form.controls[index].value};
          path.push(feed);
          break;
        case 'direccion':
          feed = {"op":"replace","path":"/direction","value":form.controls[index].value};
          path.push(feed);
          break;
        case 'telefono':
          feed = {"op":"replace","path":"/phone","value":form.controls[index].value};
          path.push(feed);
          break;
        case 'telefonoComercio':
          feed = {"op":"replace","path":"/phone","value":form.controls[index].value};
          path.push(feed);
          break;
      }
    }
    return path;
  }

  crearJsonParametros(arreglo:string[],form:FormGroup, adminAcc:Number, fullJson:string[]){
    let json;
    let array=[];
    let idAccount = localStorage.getItem('idAccount');
    for(let i = 0; i < arreglo.length; i++){
      let index = arreglo[i];      
      switch(index){
        case 'cantidad':
          if(adminAcc==null){
            json = {"fk_account":idAccount,"fk_parameter":1,"parameter_value":Number(form.controls[index].value)};
            array.push(json);
          }else{
            json = {"fk_account":adminAcc,"fk_parameter":1,"parameter_value":Number(form.controls[index].value)};
            fullJson.push(json);
          }
          break;
        case 'monto':
          if(adminAcc==null){
            json = {"fk_account":idAccount,"fk_parameter":2,"parameter_value":Number(form.controls[index].value)};
            array.push(json);
          }else{
            json = {"fk_account":adminAcc,"fk_parameter":2,"parameter_value":Number(form.controls[index].value)};
            fullJson.push(json);
          }
          break;
        case 'limite':
          if(adminAcc==null){
            json = {"fk_account":idAccount,"fk_parameter":3,"parameter_value":Number(form.controls[index].value)};
            array.push(json);
          }else{
            json = {"fk_account":adminAcc,"fk_parameter":3,"parameter_value":Number(form.controls[index].value)};
            fullJson.push(json);
          }
          break;
      }
    }
    if(adminAcc == null)
      return array;
    else
      return fullJson;
  }
}
