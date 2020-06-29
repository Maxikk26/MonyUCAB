import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService, AccountService, SharedService } from './../../services/service.index';
import { PersonaRegistro } from 'src/app/models/persona-registro.model';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare function init_plugins();

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./../login.component.css'],
  providers: [DatePipe]
})
export class PersonaComponent implements OnInit {

  form: FormGroup;
  date: Date;
  currentDate: string;
  incorrect: string;
  parametros: any[];
  paises: Object;

  constructor(
    public _personaService: UsuarioService,
    private datePipe: DatePipe,
    public router: Router,
    public _accountService: AccountService,
    private http: HttpClient, 
    public dataService: SharedService
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
      nombre: new FormControl(null, Validators.required),
      apellido: new FormControl(null, Validators.required),
      fechaNac: new FormControl(null, Validators.required),
      paisNac: new FormControl(null, Validators.required),
      genero: new FormControl(null, Validators.required),
      usuario: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      pass: new FormControl(null, Validators.required),
      pass2: new FormControl(null, Validators.required),
      direccion: new FormControl(null, Validators.required),
      telefono: new FormControl(null, Validators.required),
      identificacion: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('pass','pass2') });

    /* this.form.patchValue({
      nombre: 'Maximiliano',
      apellido: 'Bogoljubskij',
      fechaNac:'26/01/1999',
      genero:'Male',
      usuario:'Maxikk26',
      correo:'maximiliano.bogo@gmail.com',
      pass:'123456',
      pass2:'123456',
      direccion:'Colinas de Bello Monte',
      telefono:'04142904335',
      identificacion:'26573051',
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

  registrarPersona(){
    console.log('currentDate: '+this.currentDate);
    if(this.form.invalid){
      console.log('Invalido');
      let error = this.findInvalidControls();
      switch (error){
        case 'correo':
          this.incorrect = 'Correo Inválido.';
          break;
      }
      this.imprimirError(this.incorrect);
      return;
    }
    if(!this.form.value.condiciones){
      this.imprimirError('Debe de aceptar las condiciones.');
      return;
    }

    this.form.value.fechaNac = this.datePipe.transform(this.form.value.fechaNac,'yyyy-MM-dd');
    
    let persona = new PersonaRegistro(
      this.form.value.usuario,
      this.currentDate,
      this.form.value.correo,
      this.form.value.direccion,
      this.form.value.telefono,
      this.form.value.identificacion,
      1,
      3,
      this.form.value.nombre,
      this.form.value.apellido,
      this.form.value.fechaNac + 'T00:00:00',
      this.form.value.paisNac,
      this.form.value.genero,
      this.form.value.pass,
      1
    );
    

    this._personaService.crearUsuario(persona)
    .subscribe(resp =>{
      let json = {"username":this.form.value.usuario,"pw_password":this.form.value.pass}
      this._personaService.falseLogin(json).subscribe((resp:any)=>{
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
        Swal.fire({
          title: '¡Exito!',
          text: 'Registrado satisfactoriamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      });
      this.dataService.alert = true;
    },((error: HttpErrorResponse) =>{
      console.log(error);
      if(error.error.includes('El Email Ingresado ya Existe'))
        this.imprimirError('El correo ingresado ya existe');
      if(error.error.includes('El Usuario Ingresado ya Existe'))
        this.imprimirError('El usuario ingresado ya existe');
      else
        this.imprimirError('El correo ingresado ya existe');
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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            return name;
        }
    }
}

}
