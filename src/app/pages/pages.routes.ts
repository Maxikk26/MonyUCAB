import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LoginGuardGuard } from './../services/guards/login-guard.guard';
import { AccountComponent } from './account/account.component';
import { RechargeComponent } from './recharge/recharge.component';
import { BalanceComponent } from './balance/balance.component';



const pagesRoutes:Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate:[LoginGuardGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'}},
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de Perfil'}},
            { path: 'account', component: AccountComponent, data: {titulo: 'Mi Perfil'}},
            { path: 'recharge', component: RechargeComponent, data: {titulo: 'Recarga de Saldo'}},
            { path: 'balance', component: BalanceComponent, data: {titulo: 'Saldo en Cuenta'}},
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
            

    ]},
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);