import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from './../../config/config';
import { HttpClient} from '@angular/common/http';
import { ComercioRegistro } from './../../models/comercio-registro.model';

@Injectable({
  providedIn: 'root'
})
export class ComercioService {
  comercio: ComercioRegistro[] =
  [{
    username: '',
    register_date: '',
    email: '',
    direction: '',
    phone: '',
    identification: '',
    user_status: 0,
    failed_attempts: 0,
    sub_user: 0,
    commerce_name: '',
    country: '',
    contact_name: '',
    contact_celphone: '',
    commission: 0.1,
    pw_password: '',
    pw_date: '',
    pw_status: 0,
  }
];

  constructor(
    public http: HttpClient
  ) { }

  vacio(){
    return this.comercio[0];
  }

  getComercio(id:string){
    let url = URL_SERVICIOS + '/commerces/'+id;
    return  this.http.get(url);
  }
}
