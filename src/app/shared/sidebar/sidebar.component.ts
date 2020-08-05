import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from 'src/app/services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: string;
  saldo = false;
  adminrole= false;
  normal = true;
  retiros = false;

  saldo1 = false;
  normal1 = true;
  retiros1= false;
  admin1 = false;

  constructor(
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    this.usuario = localStorage.getItem('usuario');
    let rol = localStorage.getItem('rol');
    switch(rol){
      case 'natural':
        this.saldo = true;
        break;
      case 'juridico':
        this.retiros = true;
        break;
      case 'admin':
        this.normal = false;
        this.adminrole = true;
        break;

    };

  }

}
