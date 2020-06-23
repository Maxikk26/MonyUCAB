import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';
import { PersonaComponent } from './login/persona/persona.component';
import { ComercioComponent } from './login/comercio/comercio.component';
import { UserRecoverComponent } from './login/user-recover/user-recover.component';
import { PassRecoverComponent } from './login/pass-recover/pass-recover.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'registerpersona', component: PersonaComponent},
    { path: 'registercomercio', component: ComercioComponent},
    { path: 'recoveruser', component: UserRecoverComponent},
    { path: 'recoverpassword', component: PassRecoverComponent},
    { path: '**', component: NopagefoundComponent},
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, {useHash: true});