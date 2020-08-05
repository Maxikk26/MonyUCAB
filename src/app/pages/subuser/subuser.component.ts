import { Component, OnInit } from '@angular/core';
import { PersonaService, UsuarioService } from 'src/app/services/service.index';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subuser',
  templateUrl: './subuser.component.html',
  styles: [],
  providers: [DatePipe]
})
export class SubuserComponent implements OnInit {
  subuser;
  form: FormGroup;
  paises: Object;
  date: Date;
  currentDate: string;
  incorrect: string;

  constructor(
    public _personaService: PersonaService,
    private http: HttpClient, 
    private datePipe: DatePipe,
    public _userService: UsuarioService
  ) { 
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
    this.subuser = this._personaService.subUserVacio();
    let id = localStorage.getItem('id');
    let idAccount = localStorage.getItem('idAccount');
    this.subuser.fk_account = Number(idAccount);
    this.subuser.fk_user = Number(id);
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
      identificacion: new FormControl(null, Validators.required)
    }, { validators: this.sonIguales('pass','pass2') });

    this.http.get("/assets/json/countries.json").pipe(map(data => {
      this.paises = Object.keys(data).map(x=>data[x])[0];
      //console.log(data);
    })).subscribe(result => {
      //console.log(result);
    });
  }

  submit(){

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
    this.form.value.fechaNac = this.datePipe.transform(this.form.value.fechaNac,'yyyy-MM-dd');
    this.subuser.username = this.form.value.usuario;
    this.subuser.register_date = this.currentDate;
    this.subuser.email = this.form.value.correo;
    this.subuser.direction = this.form.value.direccion;
    this.subuser.phone = this.form.value.telefono;
    this.subuser.identification = this.form.value.identificacion;
    this.subuser.first_name = this.form.value.nombre;
    this.subuser.last_name = this.form.value.apellido;
    this.subuser.birthdate = this.form.value.fechaNac + 'T00:00:00';
    this.subuser.birth_country = this.form.value.paisNac;
    this.subuser.gender = this.form.value.genero;
    this.subuser.pw_password = this.form.value.pass;
    this.subuser.pw_date = this.currentDate;
    console.log(this.subuser);
    
    this._userService.postSubUser(this.subuser).subscribe(res=>{
      console.log(res);
      this.mostrarValidacion('Exito','Se ha creado satisfactoriamente el usuario','success','Ok');
    },(error:HttpErrorResponse)=>{
      console.log(error);
      this.mostrarValidacion('Error','Error del sistema por favor comuniquese con un administrador','error','Ok');
    })


  }

  imprimirError(error:string){
    Swal.fire({
      title: '¡Alerta!',
      text: error,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  mostrarValidacion(titulo,texto,icono,confimacion){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: confimacion
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
