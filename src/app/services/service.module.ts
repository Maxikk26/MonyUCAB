import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, SidebarService, SharedService, LoginGuardGuard,PersonaService,ComercioService,AccountService,RechargeService,ReportsService,AdminGuardGuard } from './service.index';



@NgModule({
  declarations: [],
  imports: [
CommonModule
  ],
  providers:[
    SettingsService, 
    SidebarService, 
    SharedService,
    LoginGuardGuard,
    RechargeService,
    AccountService,
    PersonaService,
    ComercioService,
    ReportsService,
    AdminGuardGuard
  ]
})
export class ServiceModule { }
