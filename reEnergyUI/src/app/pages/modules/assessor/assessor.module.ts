import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from 'src/app/core/services/auth.interceptor';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AssessorRoutingModule } from './assessor-routing.module';
import { AsrcalenderComponent } from './asrcalender/asrcalender.component';
import { DaOaAllocatedHospComponent } from './da-allocation/da-oa-allocated-hosp.component';
import { LaddaModule } from 'angular2-ladda';
import { NgxPaginationModule } from 'ngx-pagination';
import { DaAllocatedHospComponent } from './da-allocations/da-allocated-hosp.component';

@NgModule({
  imports: [
    CommonModule,
    FullCalendarModule,
    AssessorRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LaddaModule,
    NgxPaginationModule
  ],
  declarations: [AsrcalenderComponent, DaOaAllocatedHospComponent, DaAllocatedHospComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ]
})

export class AssessorModule { }
