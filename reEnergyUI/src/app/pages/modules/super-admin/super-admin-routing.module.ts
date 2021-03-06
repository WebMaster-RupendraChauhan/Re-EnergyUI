import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AsrlistComponent } from './asrlist/asrlist.component';
import { UserListComponent } from './userlist/user-list.component';
import { HospitalListComponent } from './hospitallist/hospital-list.component';
import { HospitalTrackerComponent } from './hospital-tracker/hospital-tracker.component';
import { DaAllocateComponent } from './da-allocation/da-allocate.component';
import { CertifiedHospitalComponent } from './certified-hospital/certified-hospital.component';
import { OaAllocationComponent } from './oa-allocation/oa-allocation.component';
import { CcAllocationComponent } from './cc-allocation/cc-allocation.component';
import { CcAllocationFilter } from '../../model/FilterRow.model';
import { ApplicationTracerComponent } from './application-tracer/application-tracer.component';
import { StudiosComponent } from './studios/studios.component';
import { UsersComponent } from './users/users.component';
import { LiveVedioSheduleComponent } from './live-vedio-shedule/live-vedio-shedule.component';
import { OnDemaindVideoComponent } from './on-demaind-video/on-demaind-video.component';
import { PricingComponent } from './pricing/pricing.component';
import { MasterDataComponent } from './master-data/master-data.component';
import { CustomersComponent } from './customers/customers.component';
const route: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hospitals',
        component: HospitalListComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'customer',
        component: CustomersComponent
      },
      {
        path: 'master',
        component: MasterDataComponent
      },
      {
        path: 'studios',
        component: StudiosComponent
      },
      {
        path: 'price',
        component: PricingComponent
      },
      {
        path: 'user',
        component: UsersComponent
      },
      {
        path: 'livevedoshedule',
        component: LiveVedioSheduleComponent
      },
      {
        path: 'vedios',
        component: OnDemaindVideoComponent
      },
      {
        path: 'applicationtracker',
        component: HospitalTrackerComponent
      },
      {
        path: 'daallocation',
        component: DaAllocateComponent
      },
      {
        path: 'ccallocation',
        component: CcAllocationComponent
      },
      {
        path: 'oaallocation',
        component: OaAllocationComponent
      },
      {
        path: 'assessorlist',
        component: AsrlistComponent
      },
      {
        path: 'certified',
        component: CertifiedHospitalComponent
      },
      {
        path: 'paytrack',
        component: ApplicationTracerComponent
      },
      // {
      //   path: 'allocateqc',
      //   component: QcAssessorAllocationComponent
      // },
      // {
      //   path: 'paytrack',
      //   component: PaytrackListComponent
      // }

    ]
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})

export class SuperAdminRoutingModule { }
