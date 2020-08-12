import { Component, OnInit } from '@angular/core';
import { UsuarioService, PersonaService, ComercioService, AccountService } from 'src/app/services/service.index';
import { Persona } from 'src/app/models/persona.model';
import { Comercio } from 'src/app/models/comercio.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {
  comercio: Comercio;
  persona: Persona;
  usuario: Usuario;
  natural: boolean;
  nroCuenta: string;

  constructor(
    public _usuarioService: UsuarioService,
    public _personaService: PersonaService,
    public _comercioService: ComercioService,
    public _accountService: AccountService
  ) {

    }

  ngOnInit() {
    let id = localStorage.getItem('id');
    let rol = localStorage.getItem('rol');
    let idAccount = localStorage.getItem('idAccount');
    this._usuarioService.getUsuario(id).subscribe((resp:Usuario)=>{
      this.usuario = resp;
    });
    this._accountService.getAccount(id).subscribe((resp:any)=>{
      this.nroCuenta = resp.account_number;
    });
    if(rol === 'natural'){
      this.natural = true;
      this._personaService.getPersona(id).subscribe((resp:Persona)=>{
        this.persona = resp;
      });
    }
    else if(rol === 'juridico'){
      this.natural = false;
      this._comercioService.getComercio(id).subscribe((resp: Comercio)=>{
        this.comercio = resp;
      })
    }
      
  }

 

}
