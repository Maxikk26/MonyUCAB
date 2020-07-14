import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SettingsService } from 'src/app/services/settings/settings.service';
import { UsuarioService, ComercioService, PersonaService, AccountService } from 'src/app/services/service.index';
import { ComercioRegistro } from './../../models/comercio-registro.model';
import { PersonaRegistro } from './../../models/persona-registro.model';
import { Router } from '@angular/router';
import  Swal  from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  password: FormGroup;
  formPerson: FormGroup;
  formSubUser: FormGroup;
  parametros: FormGroup;
  formCommerce: FormGroup;
  formAux: FormGroup;
  formAux2: FormGroup;
  reference: Object;
  forma: boolean ;
  comercio: ComercioRegistro;
  persona: PersonaRegistro;
  rol = false;

   constructor( 
    public _ajustes: SettingsService,
    public _usuarioService: UsuarioService,
    public _personaService: PersonaService,
    public _comercioService: ComercioService,
    public _accountService: AccountService,
    private router: Router
  ) {

    
   }

   sonIguales(campo1:string, campo2:string){
    return (group: FormGroup)=>{
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;
      if(pass1 === pass2){
        return null;
      }
      return {
        sonIguales:true
      };
    };
  }

  ngOnInit() {

    //Forms de persona

    this.comercio = this._comercioService.vacio();
    this.persona = this._personaService.vacio();
    this.formCommerce = new FormGroup({
      telefonoComercio: new FormControl(this.comercio.contact_celphone, Validators.required),
      pais: new FormControl(this.comercio.country, Validators.required),
      correo: new FormControl(this.comercio.email, [Validators.required, Validators.email]),
      direccion: new FormControl(this.comercio.direction, Validators.required),
      nombreContacto: new FormControl(this.comercio.contact_name, Validators.required),
      telefono: new FormControl(this.comercio.phone, Validators.required),
    });
    this.formPerson = new FormGroup({
      nombre: new FormControl(this.persona.first_name, Validators.required),
      apellido: new FormControl(this.persona.last_name, Validators.required),
      genero: new FormControl(this.persona.gender, Validators.required),
      correo: new FormControl(this.persona.email, [Validators.required, Validators.email]),
      direccion: new FormControl(this.persona.direction, Validators.required),
      telefono: new FormControl(this.persona.phone, Validators.required)
    });
    this.password = new FormGroup({
      pass1: new FormControl(null, Validators.required),
      pass2: new FormControl(null, Validators.required)
    },{ validators: this.sonIguales('pass1','pass2') });
    this.parametros =  new FormGroup({
      cantidad: new FormControl(null, Validators.required),
      monto: new FormControl(null, Validators.required),
      limite: new FormControl(null, Validators.required)
    });
    this.colocarCheck();
    let id = localStorage.getItem('id');
    let rol = localStorage.getItem('rol');
    let idAccount = localStorage.getItem('idAccount');
    this._accountService.getParameters(idAccount).subscribe((resp:any)=>{
      this.setParametros(resp);
    });
    if(rol === 'natural'){
      this.rol = true;
      this._personaService.getPersona(id).subscribe(resp=>{
        this.forma = true;
        this.formPersona(resp);
      });
    }else if(rol === 'juridico'){
      this._comercioService.getComercio(id).subscribe(resp=>{
        this.forma = false;
        this.formComercio(resp);
      });
    }
    
  }
  setParametros(json:any){
    this.formAux2 = new FormGroup({
      cantidad: new FormControl(null),
      monto: new FormControl(null),
      limite: new FormControl(null)
    });
    for(let i = 0; i < json.length; i++){
      console.log(json[i]);
      let name = json[i].parameter_name;
      let value = json[i].parameter_value;
      switch(name){
        case 'Cantidad de Transacciones':
          this.parametros.patchValue({cantidad:value});
          this.formAux2.patchValue({cantidad:value});
          break;
        case 'Monto diario':
          this.parametros.patchValue({monto:value});
          this.formAux2.patchValue({monto:value});
          break;
        case 'Limite por transaccion':
          this.parametros.patchValue({limite:value});
          this.formAux2.patchValue({limite:value});
          break;
      }
    }
  }
  
  configurarParametros(){
    this.validarForms(this.parametros,this.formAux2,true);
  }

  cambiarContrasena(){
    let id = localStorage.getItem('id');
    let pass = this.password.controls['pass1'].value;
    let aux = '{"pw_password":"'+pass+'","fk_user_mu":"'+id+'"}';
    let json = JSON.parse(aux);
    json.fk_user_mu = parseInt(json.fk_user_mu);
    this._usuarioService.putPassword(json).subscribe(resp=>{
      this.mostrarValidacion('Cambiar Contraseña','Su contraseña ha sido cambiada exitosamente','success','Ok');      
    }, (error: HttpErrorResponse)=>{
      this.mostrarValidacion('Cambiar Contraseña','Su contraseña debe ser diferente a las ultimas 3 utilizadas','error','Ok');
      
    });
  }

  cambiarColor(tema: string, link: any){
    this.aplicarCheck(link);
    this._ajustes.aplicarTema(tema);
    
  }

  aplicarCheck(link:any){
    let selectores: any = document.getElementsByClassName('selector');
    for(let ref of selectores){
      ref.classList.remove('working');
    }

    link.classList.add('working');
  }

  colocarCheck(){
    let selectores: any = document.getElementsByClassName('selector');
    let tema = this._ajustes.ajustes.tema;
    for(let ref of selectores){
      if( ref.getAttribute('data-theme') == tema){
        ref.classList.add('working');
        break;
      }
    }
  }

  formComercio(comercio: any){
    if(!this.forma){
      this._usuarioService.getUsuario(comercio.fk_user_mu).subscribe((user:any)=>{
        this.formCommerce.setValue({
          telefonoComercio: user.phone,
          pais: comercio.country,
          correo: user.email,
          direccion: user.direction,
          nombreContacto: comercio.contact_name,
          telefono: comercio.contact_celphone
        });
        this.formAux = new FormGroup({
          telefonoComercio: new FormControl(this.comercio.contact_celphone, Validators.required),
          pais: new FormControl(this.comercio.country, Validators.required),
          correo: new FormControl(this.comercio.email, [Validators.required, Validators.email]),
          direccion: new FormControl(this.comercio.direction, Validators.required),
          nombreContacto: new FormControl(this.comercio.contact_name, Validators.required),
          telefono: new FormControl(this.comercio.phone, Validators.required),
        });
        this.formAux.setValue({
          telefonoComercio: user.phone,
          pais: comercio.country,
          correo: user.email,
          direccion: user.direction,
          nombreContacto: comercio.contact_name,
          telefono: comercio.contact_celphone
        });

      });
    }
  }

  formPersona(persona: any){
    if(this.forma){
      this._usuarioService.getUsuario(persona.fk_user_mu).subscribe((user:any)=>{
        this.formPerson.setValue({
          nombre: persona.first_name,
          apellido:persona.last_name,
          genero: persona.gender,
          correo: user.email,
          direccion: user.direction,
          telefono:user.phone
        });
        this.formAux = new FormGroup({
          nombre: new FormControl(this.persona.first_name, Validators.required),
          apellido: new FormControl(this.persona.last_name, Validators.required),
          genero: new FormControl(this.persona.gender, Validators.required),
          correo: new FormControl(this.persona.email, [Validators.required, Validators.email]),
          direccion: new FormControl(this.persona.direction, Validators.required),
          telefono: new FormControl(this.persona.phone, Validators.required)
        });
        this.formAux.setValue({
          nombre: persona.first_name,
          apellido:persona.last_name,
          genero: persona.gender,
          correo: user.email,
          direccion: user.direction,
          telefono:user.phone
        });
      });
    }
  }
 
  // Returns true if the user has changed the value in the form
  isDifferent(value1: string, value2: string) {
    return value1 !== value2;
  }

  mostrarValidacion(titulo,texto,icono,confimacion){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: confimacion
    });
  }

  validarForms(form1: FormGroup, formAux:FormGroup,parametros:boolean){
    let id = localStorage.getItem('id');
    let arreglo = [];
    let json = [];
    for(let key in form1.controls){
      if(this.isDifferent(form1.controls[key].value,formAux.controls[key].value)){
        arreglo.push(key);
      }
    }
    if(parametros){
      let json1 = this._accountService.crearJsonParametros(arreglo,form1);
      /* console.log(json1); */
      for(let i = 0;i < json1.length;i++){
        this._accountService.putParameters(json1[i]).subscribe((resp:any)=>{
          this.mostrarValidacion('¡Modificación exitosa!','Sus parametros han sido modificados exitosamente','success','Ok');
        },(error:HttpErrorResponse)=>{
          this.mostrarValidacion('Error','Se ha producido un error inesperado','error','Ok');
        });
      }
      return;
    }
    if(this.forma){
      json = this._accountService.crearJsonPersona(arreglo,form1);
      let path = this._accountService.crearJsonUsuario(arreglo,form1);
      this._accountService.patchPerson(id,json).subscribe((resp)=>{
        if(path.length){
          this._accountService.patchUsuario(id,path).subscribe((resp)=>{
            this.mostrarValidacion('¡Modificación exitosa!','Sus datos han sido modificados exitosamente','success','Ok');
          },(error: HttpErrorResponse)=>{
            this.mostrarValidacion('Error',error.message,'error','Ok');
            console.log(error);
          })
        }else{
          this.mostrarValidacion('¡Modificación exitosa!','Sus datos han sido modificados exitosamente','success','Ok');
        }
      },(error:HttpErrorResponse)=>{
        this.mostrarValidacion('Error',error.message,'error','Ok');
        console.log(error);
      });
    }
    else{
      json = this._accountService.crearJsonComercio(arreglo,form1);
      let path = this._accountService.crearJsonUsuario(arreglo,form1);
      this._accountService.patchComercio(id,json).subscribe(resp=>{
        if(path.length){
          this._accountService.patchUsuario(id,path).subscribe((resp)=>{
            this.mostrarValidacion('¡Modificación exitosa!','Sus datos han sido modificados exitosamente','success','Ok');

          },(error:HttpErrorResponse)=>{
            this.mostrarValidacion('Error',error.message,'error','Ok');
          });
        }
        else{
          this.mostrarValidacion('¡Modificación exitosa!','Sus datos han sido modificados exitosamente','success','Ok');
        }
      },(error:HttpErrorResponse)=>{
        this.mostrarValidacion('Error',error.message,'error','Ok');
      });
    }
  }
  
  modificarDatos(){
    if(this.forma){
     this.validarForms(this.formPerson,this.formAux,false);
    }
    else{
      this.validarForms(this.formCommerce,this.formAux,false);
    }
  }


}
