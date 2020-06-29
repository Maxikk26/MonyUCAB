import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { HttpClient,HttpErrorResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService, SharedService } from './../../services/service.index';
import Swal from 'sweetalert2';
import { ComercioRegistro } from './../../models/comercio-registro.model';
import { AccountService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./../login.component.css'],
  providers:[DatePipe]
})

export class ComercioComponent implements OnInit {

  form: FormGroup;
  date: Date;
  currentDate: string;
  parametros: any[];
  paises: Object;

  constructor(
    public _comercioService: UsuarioService,
    private datePipe: DatePipe,
    public _accountService: AccountService,
    public dataService: SharedService,
    public http: HttpClient,
    public router: Router 
    )
  {
  
    
    this.date = new Date();
    this.currentDate = this.datePipe.transform(this.date,'yyyy-MM-dd');
    this.currentDate = this.currentDate + 'T00:00:00';
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
    init_plugins();
    this.parametros = this._accountService.parametrosBase();
    this.form = new FormGroup({
      nombreComercio: new FormControl(null, Validators.required),
      rif: new FormControl(null, Validators.required),
      telefonoComercio: new FormControl(null, Validators.required),
      pais: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      direccion: new FormControl(null, Validators.required),
      nombreContacto: new FormControl(null, Validators.required),
      telefono: new FormControl(null, Validators.required),
      usuario: new FormControl(null, Validators.required),
      pass: new FormControl(null, Validators.required),
      pass2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('pass', 'pass2') });

    /* this.form.setValue({
      nombreComercio: 'UCAB',
      rif: '159874',
      telefonoComercio:'02127533314',
      pais:'Venezuela',
      correo:'maximiliano.bogo@gmail.com',
      direccion:'Montalban',
      nombreContacto:'Maximiliano Bogoljubskij',
      telefono:'04142904335',
      usuario:'Maxikk26',
      pass:'123',
      pass2:'123',
      condiciones: true
    }); */

    //Para poblar los países

    this.http.get("/assets/json/countries.json").pipe(map(data => {
      this.paises = Object.keys(data).map(x=>data[x])[0];
      console.log(data);
    })).subscribe(result => {
      console.log(result);
    });
  }

  registrarComercio(){
    console.log('currentDate: '+this.currentDate);
    if(this.form.invalid){
      console.log('Invalido');
      // this.findInvalidControls();
      return;
    }
    if(!this.form.value.condiciones){
      Swal.fire({
        title: 'Importante',
        text: 'Debe de aceptar las condiciones',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
    
    let comercio = new ComercioRegistro(
      this.form.value.usuario,
      this.currentDate,
      this.form.value.correo,
      this.form.value.direccion,
      this.form.value.telefonoComercio,
      this.form.value.rif,
      1,
      3,
      this.form.value.nombreComercio,
      this.form.value.pais,
      this.form.value.nombreContacto,
      this.form.value.telefono,
      this.form.value.pass,
      this.currentDate,
      1
    );

    console.log(comercio);

    this._comercioService.crearUsuario(comercio)
    .subscribe(resp =>{
      let json = {"username":this.form.value.usuario,"pw_password":this.form.value.pass}
      this._comercioService.falseLogin(json).subscribe((resp:any)=>{
        let id = resp.id;
        this._accountService.getAccount(id).subscribe((resp:any)=>{
          for(let i = 0; i <= 2; i++){
            this.parametros[i].fk_account = resp.id_account;
            this._accountService.postParameters(this.parametros[i]).subscribe(resp =>{
            },(error: HttpErrorResponse)=>{
              this.imprimirError(error.message);
              
            });
          }
        });
        /* Swal.fire({
          title: '¡Exito!',
          text: 'Registrado satisfactoriamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        }); */
      });
      console.log(json);
      console.log(resp);
      this.dataService.alert = true;
      this.router.navigate(['login']);
    },((error: HttpErrorResponse) =>{
      console.log(error);
      if(error.error.includes('El Email Ingresado ya Existe'))
        this.imprimirError('El correo ingresado ya existe');
      if(error.error.includes('El Usuario Ingresado ya Existe'))
        this.imprimirError('El usuario ingresado ya existe');
    }));

    
  }

  imprimirError(error:string){
    Swal.fire({
      title: '¡Alerta!',
      text: error,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
