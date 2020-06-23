import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from 'src/app/services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: string;
  natural: boolean;

  constructor(
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    this.usuario = localStorage.getItem('usuario');
    let rol = localStorage.getItem('rol');
    if(rol == 'natural')
      this.natural = true;
    else
      this.natural = false;

  }

}
