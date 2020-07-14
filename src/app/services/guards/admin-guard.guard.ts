import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from './../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(public router: Router,
    public _usuarioService:UsuarioService){ }

  canActivate(){
    console.log(this._usuarioService.adminState.value);
    if(this._usuarioService.adminState.value)
      return true;
    else{
      this.router.navigate(['/login']);
    }
    
  }
  
}
