import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/services/service.index';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-pass-recover',
  templateUrl: './pass-recover.component.html',
  styleUrls: ['./../login.component.css']
})
export class PassRecoverComponent implements OnInit {
  user:string;

  constructor(
    public _usuarioService: UsuarioService
  ) 
    { 

    }

  ngOnInit() {
    init_plugins();
  }

  recuperarContrasena(form: NgForm){
    if(form.invalid){
      return;
    }
    console.log(form.value.usuario);
    
    let aux = '{"username":"'+form.value.usuario+'"}';
    let json = JSON.parse(aux);
    console.log(json);
    
    this._usuarioService.postPasswordRecovery(json).subscribe(resp=>{

    },(error:HttpErrorResponse)=>{
      if(error.status === 200)
        Swal.fire({
          title: 'Recuperación de Usuario',
          text: 'Se ha mandado un correo con el nombre de usuario',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      else{
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        }); 
      }
      
    });
  }

}
