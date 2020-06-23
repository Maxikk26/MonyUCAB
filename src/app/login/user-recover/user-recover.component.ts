import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

declare function init_plugins();

@Component({
  selector: 'app-user-recover',
  templateUrl: './user-recover.component.html',
  styleUrls: ['./../login.component.css']
})
export class UserRecoverComponent implements OnInit {
  form: FormGroup;

  constructor(
    public _usuarioService: UsuarioService
  ) {

    }

  ngOnInit() {
    init_plugins();
    this.form = new FormGroup({
      correo: new FormControl(null, [Validators.required,Validators.email])
    });
  }

  recuperarUsuario(){
    let aux = '{"email":"'+this.form.controls['correo'].value+'"}';
    let json = JSON.parse(aux);
    this._usuarioService.postUserRecovery(json).subscribe(resp=>{
      
    }, (error: HttpErrorResponse)=>{
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
