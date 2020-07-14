import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountComponent } from './account/account.component';
import { RechargeComponent } from './recharge/recharge.component';
import { BalanceComponent } from './balance/balance.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuardGuard, LoginGuardGuard } from '../services/service.index';
import { SubuserComponent } from './subuser/subuser.component';
import { OutsiderechargeComponent } from './recharge/outsiderecharge.component';
import { ExternalrechargeComponent } from './recharge/externalrecharge.component';

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
            { path: 'subuser', component: SubuserComponent, data: {titulo: 'Crear Sub-Usuarios'}},
            { path: 'outsiderecharge', component: OutsiderechargeComponent, data: {titulo: 'Recargar Saldo con Paypal o Stripe'}},
            { path: 'externalrecharge', component: ExternalrechargeComponent, data: {titulo: 'Recargar Saldo con Paypal o Stripe'}},
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
            

    ]},
    {
        path: '',
        component: PagesComponent,
        canActivate:[AdminGuardGuard],
        children: [
            { path: 'admin-dashboard', component: AdminComponent, data: {titulo: 'Admin Dashboard'}},           

    ]},
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);