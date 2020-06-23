import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { PagesModule } from './pages/pages.module';


// Componentes
import { AppComponent } from './app.component';
import { RegisterComponent } from './login/register.component';
import { LoginComponent } from './login/login.component';

// Servicios
import { ServiceModule } from './services/service.module';


// Temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonaComponent } from './login/persona/persona.component';
import { ComercioComponent } from './login/comercio/comercio.component';
import { UserRecoverComponent } from './login/user-recover/user-recover.component';
import { PassRecoverComponent } from './login/pass-recover/pass-recover.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PersonaComponent,
    ComercioComponent,
    UserRecoverComponent,
    PassRecoverComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ServiceModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
