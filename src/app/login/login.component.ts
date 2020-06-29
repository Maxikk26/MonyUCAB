import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from './../models/login.model';
import { AccountService, UsuarioService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterContentInit {

  recuerdame: boolean = false;
  user:string;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService,
    public _accountService: AccountService,
    public dataService: SharedService)
    {
      
    }

  ngOnInit() {
    init_plugins();
    this.user = localStorage.getItem('recordar') || '';
    if(this.user.length > 1)
      this.recuerdame = true; 
  }

  /* ngAfterContentInit(){
    if (this.dataService.alert){
      this.dataService.alert = false;
      Swal.fire({
        title: 'Aviso',
        text: 'El usuario se ha creado satisfactoriamente, inicie sesión con su usuario y contraseña.',
        icon: 'success',
        confirmButtonText: 'Ok'
      })
    }
  } */

  ingresar(form: NgForm) {
    if(form.invalid){
      return;
    }
    let usuario = new Login(0,form.value.usuario, form.value.pass,'');
    console.log(usuario);
    this._usuarioService.login(usuario, form.value.recuerdame)
                        .subscribe(resp =>{
                          let id = localStorage.getItem('id');
                          this._accountService.getAccount(id).subscribe((resp:any)=>{
                            console.log(resp);
                            let idAccount = resp.id_account;
                            localStorage.setItem('idAccount',idAccount);
                          });
                          this.router.navigate(['/dashboard']);
                        },((error: HttpErrorResponse) =>{
                          Swal.fire({
                            title: '¡Alerta!',
                            text: 'Usuario y/o contraseña incorrecta',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                          });
                        }));
    
  }

}
