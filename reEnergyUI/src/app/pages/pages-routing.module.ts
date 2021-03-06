import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { AdminDashboardComponent } from './dashboard/admindashboard/admidashboard.component';
import { HospitalDashboardComponent } from './dashboard/hospitaldashboard/hospitaldashboard.component';
import { QuestionBankComponent } from './modules/question-bank/question-bank.component';
import { CentrequestionBankComponent } from './modules/centrequestion-bank/centrequestion-bank.component';
import { CentralComponent } from './modules/hospital/central/central.component';
// import { AssessordashboardComponent } from './dashboard/assessordashboard/assessordashboard.component';

import { AsrdashboardComponent } from './dashboard/asrdashboard/asrdashboard.component';
import { CcDashboardComponent } from './dashboard/ccdashboard/ccdashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'superadmindashboard', component: AdminDashboardComponent },
  { path: 'hospitaldashboard', component: HospitalDashboardComponent },
  // { path: 'asrdashboard', component: AssessordashboardComponent },
  { path: 'ccdashboard', component: CcDashboardComponent },
  { path: 'secretariatdashboard', component: AdminDashboardComponent }, // rrc


  { path: 'asrdashboard', component: AsrdashboardComponent },


  { path: 'questionBank', component: QuestionBankComponent },
  { path: 'centrequestionBank', component: CentrequestionBankComponent },
  { path: 'central', component: CentralComponent },


  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },



  {
    path: 'superadmin',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule),
  },
  { // rrc
    path: 'secretariat',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule),
  },
  {
    path: 'assessor',
    loadChildren: () => import('./modules/assessor/assessor.module').then(m => m.AssessorModule),
  },
  {
    path: 'comettee',
    loadChildren: () => import('./modules/comettee/comettee.module').then(m => m.CometteeModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
