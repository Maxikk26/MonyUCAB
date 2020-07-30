import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountComponent } from './account/account.component';
import { RechargeComponent } from './recharge/recharge.component';
import { BalanceComponent } from './balance/balance.component';
import { AdminComponent } from './admin/admin.component';
import { SubuserComponent } from './subuser/subuser.component';
import { OutsiderechargeComponent } from './recharge/outsiderecharge.component';
import { ExternalrechargeComponent } from './recharge/externalrecharge.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

@NgModule({
  declarations:[
      PagesComponent,
      DashboardComponent,
      AccountSettingsComponent,
      AccountComponent,
      RechargeComponent,
      AdminSettingsComponent,
      BalanceComponent,
      AdminComponent,
      SubuserComponent,
      OutsiderechargeComponent,
      ExternalrechargeComponent,
      WithdrawComponent
  ],
  exports:[
      PagesComponent,
      DashboardComponent
  ],
  imports:[
  SharedModule,
      PAGES_ROUTES,
      FormsModule,
      ReactiveFormsModule,
      CommonModule
  ]
})

export class PagesModule{}