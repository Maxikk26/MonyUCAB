import { Injectable } from '@angular/core';
import { PersonaRegistro } from '../../models/persona-registro.model';
import { URL_SERVICIOS } from './../../config/config';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  persona: PersonaRegistro[]=[{
    username: '',
    register_date: '',
    email: '',
    direction:'',
    phone: '',
    identification: '',
    user_status: 0,
    failed_attempts: 0,
    sub_user: 0,
    first_name: '',
    last_name: '',
    birthdate: '',
    birth_country: '',
    gender: '',
    pw_password: '',
    pw_status: 0,
  }]

  constructor(
    public http: HttpClient
  ) { }

  vacio(){
    return this.persona[0];
  }

  getPersona(id: string){
    let url = URL_SERVICIOS + '/persons/'+id;
    return  this.http.get(url);
  }
}
