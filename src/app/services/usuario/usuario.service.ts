import { Injectable } from '@angular/core';
import { PersonaRegistro } from 'src/app/models/persona-registro.model';
import { ComercioRegistro } from '../../models/comercio-registro.model';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICIOS } from './../../config/config';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Login } from './../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  loginState = new BehaviorSubject<boolean>(this.hasToken());
  user: string;

  
  constructor(
    public http: HttpClient,
    public router: Router
  ) { 
  }

  hasToken(){
    return !!localStorage.getItem('id');
  }

  estaLogueado(){
    console.log(this.loginState);
    
    return this.loginState.asObservable();
  }

  logout(){
    this.loginState.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('usuario');
    localStorage.removeItem('idAccount');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

  login(usuario:any, recordar: boolean = false){
    if(recordar){
      localStorage.setItem('recordar',usuario.username);
    }else{
      localStorage.removeItem('recordar');
    }
    let url = URL_SERVICIOS + '/Login';
    return this.http.post(url,usuario).pipe(
                    map( (resp : Login) => {
                      if(resp.id != 0){
                        localStorage.setItem('id',JSON.stringify(resp.id));
                        localStorage.setItem('usuario',resp.username);
                        localStorage.setItem('rol',resp.rol);
                        this.loginState.next(true);
                        return true;
                      }
                      else{
                        return false;
                      }
                    }));
  }

  falseLogin(json:any){
    let url = URL_SERVICIOS + '/Login';
    return this.http.post(url,json);
  }

  crearUsuario( usuario: any){
    if(usuario instanceof PersonaRegistro){
      console.log('Usuario persona',usuario);
      let url = URL_SERVICIOS + '/PersonsRegister';
      return this.http.post(url, usuario);
    }
    if(usuario instanceof ComercioRegistro){
      console.log('Usuario comercio',usuario);
      let url = URL_SERVICIOS + '/CommercesRegister';
      return this.http.post(url, usuario);
    }
   }

   getUsuario(id: string){
     let url = URL_SERVICIOS + '/users/'+id;
     return  this.http.get(url);
   }

   postUserRecovery(json:any){
     let url = URL_SERVICIOS + '/UserRecovery';
     return this.http.post(url,json);
   }

   postPasswordRecovery(json:any){
     let url = URL_SERVICIOS + '/PasswordRecovery';
     return this.http.post(url,json);
   }

   putPassword(json:any){
     let url = URL_SERVICIOS + '/pwhistorys';
     return this.http.put(url,json);
     
   }

   
}
