import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { EventInput } from '@fullcalendar/core';

import { Event } from './event.model';
import { category, calendarEvents } from './data';
import { AssessorService } from '../../../../pages/api-services/assessor.service';
import { AssessorCls, StateItem, CalendarInfo, EntityOperationResult, EditCalendarInfo } from '../../../model/Assessor.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Subject } from 'rxjs';


export interface CalendarMonthViewBeforeRenderEvent {
  // header: WeekDay[];
  // body: MonthViewDay[];
  // period: ViewPeriod;
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#008000',
    secondary: '#008000'
  }
};

@Component({
  selector: 'app-asrcalender',
  templateUrl: './asrcalender.component.html',
  styleUrls: ['./asrcalender.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .cal-month-view .bg-grey,
      .cal-week-view .cal-day-columns .bg-grey,
      .cal-day-view .bg-grey {
        background-color: grey !important;
      }
    `,
  ],
})

export class AsrcalenderComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  // event form
  formData: FormGroup;
  formEditData: FormGroup;
  // Form submition value
  submitted: boolean;
  // Form category data
  category: Event[];
  // Date added in event
  newEventDate: Date;
  // Edit event
  editEvent: EventInput;
  // Delete event
  deleteEvent: EventInput;
  calendarWeekends: any;
  // show events
  calendarEvents: EventInput[];
  // calendar plugin
  calendarPlugins = [dayGridPlugin, bootstrapPlugin, timeGrigPlugin, interactionPlugin];

  //#region vars
  currentUserDatails: any;

  // @ViewChild('EditModal') modalEdit: any;
  // @ViewChild('addUserModel') addUserModel: any;
  // // @ViewChild('modalContent') modalContent: TemplateRef<any>;
  // spinnerCubeDisplay = false;//defining variable for spinner
  // calendarInfo: CalendarInfo;
  // editCalendarInfo: EditCalendarInfo;
  // // view: string = 'month';
  // // viewDate: Date = new Date();
  // progress: number | boolean;
  // rootUrl: string;//url root where call hit
  // label: string;
  // // refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  // // activeDayIsOpen: boolean = false;
  // assessorId: number;
  // responseData: EntityOperationResult;
  // currentUserDatails: any;
  // ////testing////
  // @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  // view: CalendarView = CalendarView.Month;

  // CalendarView = CalendarView;

  // viewDate: Date = new Date();

  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  // };

  responseData: EntityOperationResult;
  @ViewChild('addUserModel', { static: false }) addUserModel: any;
  editCalendarInfo: EditCalendarInfo;
  viewDate: Date = new Date();
  @ViewChild('EditModal', { static: false }) modalEdit: any;
  userSearchResponse: CalendarInfo;
  refresh: Subject<any> = new Subject();
  @ViewChild('calendar', { static: false }) fullcalender: any;

  ////#endregion
  hoveredDate: NgbDate | null = null;

  // fromDate: NgbDate;
  // toDate: NgbDate | null = null;
  rootUrl: any;
  Selecteddate: Date;
  betweenDate: any[];

  constructor(private modalService: NgbModal, private auth: AuthenticationService, private formBuilder: FormBuilder, private asrService: AssessorService, calendar: NgbCalendar) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.rootUrl = auth.apiUrl;
  }
  // hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean;
  selected: any;
  //#region rupendra
  today: Date;
  maxDate: { year: number; month: number; day: number; };
  skip: number = 0;
  dummy_data=[
    {membership_catgory:'Luxury'},
    {membership_catgory:'Premium'}
  ]
  //#endregion rupendra
  model: NgbDateStruct;
  date: { year: number, month: number };
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  ngOnInit() {
    this.currentUserDatails = JSON.parse(localStorage.getItem('ayushCurrentUser'));
    // this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Calendar', active: true }];
    this.selected = '';
    /**
     * Event Model validation
     */
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      // category: ['', [Validators.required]],
    });

    /**
     * Edit Event Model Data
     */
    this.formEditData = this.formBuilder.group({
      editTitle: []
    });
    this.pageLoad_new();
    // this.pageLoad();
    // //this._fetchData();

    //#region rupendra
    this.today = new Date();
    this.maxDate = { year: new Date().getFullYear(), month: this.today.getUTCMonth() + 1, day: this.today.getUTCDate() };
    //#endregion rupendra
  }

  ngAfterViewInit() {

  }
  //#region rupendra
  addMembership(AddmembershipModel){
    this.modalService.open(AddmembershipModel, { size: 'lg' });
  }
  //#endregion rupendra
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  onDateSelection(date: NgbDate) {


    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
      // this.Selecteddate = this.fromDate + this.toDate
      this.betweenDate = [];
      while (this.fromDate <= this.toDate) {
        this.betweenDate.push(this.fromDate.getFullYear() + "-" + (this.fromDate.getMonth() + 1) + "-" + this.fromDate.getDate());
        this.fromDate.setDate(this.fromDate.getDate() + 1);
      }

      // startenddate: this.between.toString(),

      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }



  AssignEvent(itemData) {

    console.log("... AssignEvent(itemData) ...");
    console.log(itemData);

    if (itemData == null || itemData == undefined)
      return;

    for (var i = 0; i < itemData.length; i++) {
      this.events.push({
        id: itemData[i].id,
        // assessorid:itemData[i].assessorid,
        date: itemData[i].start,
        title: itemData[i].title,
        //vk
        // actions: this.actions,
      });
    }

    console.log("... After assigning data - AssignEvent(itemData) ...");
    console.log(itemData);

    this.refresh.next();
  }

  private pageLoad_new() {


    this.asrService.getLoggedInAsrCalendarRecords().subscribe(res => {

      this.userSearchResponse = res;
      this.AssignEvent(this.userSearchResponse.item);

      console.log(res);
      console.error(res);

    }, error => {
      console.log(error);
    });

  }



  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  /**
   * Open Event Modal
   * @param content modal content
   * @param event calendar event
   */
  openModal(event: any) {


    this.newEventDate = event.date;

    start: this.newEventDate || new Date();
    var seldate = this.newEventDate || new Date();
    var datetosave = seldate.getFullYear() + "-" + (seldate.getMonth() + 1) + "-" + seldate.getDate()
    var ForSaveItem = {
      startenddate: datetosave.toString(),
      title: 'Available',
    };

    this.asrService.addAssesorEvnt(ForSaveItem).subscribe(data => {

      if (data.isSuccess == true) {
        this.positionSuccess(data.message);


        this.events.splice(0, this.events.length);
        this.pageLoad_new();
        this.events;

      }
      else {
        // if(data.message.trim().toLowerCase()=='already exist')
        // {

        // }
        // else
        // {
        //   this.positionError("This Date is already marked");
        // }



        setTimeout(() => {

        }, 5000);

      }
    },
      error => {

        console.log(JSON.stringify(error));
        this.positionError(error.error.message);

      });

  }

  /**
   * Open Event Modal For Edit
   * @param editcontent modal content
   * @param event calendar event
   */
  openEditModal(event: any) {


    this.editEvent = { id: event.event.id, title: event.event.title, start: event.event.start, classNames: event.event.classNames };
    const deleteId = this.editEvent.id;
    this.delete(deleteId);

  }

  /**
   * Upldated event title save in calendar
   */


  /**
   * Delete the event from calendar
   */

  delete(deleteId) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ml-2',




      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons
      .fire({

        text: 'Are you sure you want Delete?',
        icon: 'warning',
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {

          this.asrService.deleteEvnet(deleteId).subscribe(data => {
            if (data.isSuccess == true) {
              const deleteEvent = this.events.findIndex(x => x.id + '' === deleteId + '');
              this.events.splice(deleteEvent, 1);

              this.refresh.next();


            }
            else {


            }
          }, error => {

            console.log(JSON.stringify(error));

          });
        }


        //   } else if (
        //     /* Read more about handling dismissals below */
        //     result.dismiss === Swal.DismissReason.cancel
        //   ) {

        //     return;
        //   }
      });
  }



  /**
   * Model Data save and show the event in calendar
   */
  saveEvent() {

    if (this.formData.valid) {
      const title = this.formData.get('title').value;
      start: this.newEventDate || new Date();
      var seldate = this.newEventDate || new Date();
      var datetosave = seldate.getFullYear() + "-" + (seldate.getMonth() + 1) + "-" + seldate.getDate()
      // tslint:disable-next-line: no-shadowed-variable
      // const category = this.formData.get('category').value;

      // this.calendarEvents = this.calendarEvents.concat({
      //   id: this.calendarEvents.length + 1,
      //   title,
      //   className: category,
      //   start: this.newEventDate || new Date()
      // });
      this.formData = this.formBuilder.group({
        title: '',
        // category: ''
        // start: this.newEventDate || new Date()
      });



      var ForSaveItem = {
        startenddate: datetosave.toString(),
        title: title,
      };
      // this.asrService.addEvent(this.formData).subscribe(result=>{},
      //   error => {

      //     console.log(JSON.stringify(error));
      //   });
      this.asrService.addAssesorEvnt(ForSaveItem).subscribe(data => {
        if (data.isSuccess == true) {
          this.positionSuccess(data.message);


          this.events.splice(0, this.events.length);
          this.pageLoad_new();
          this.events;

        }
        else {

          this.positionError("This Date is already marked");

          setTimeout(() => {

          }, 5000);

        }
      },
        error => {

          console.log(JSON.stringify(error));
          this.positionError(error.error.message);

        });
      // this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  private _fetchData() {

    // Event category
    this.category = category;
    // Calender Event Data
    this.calendarEvents = calendarEvents;

    // form submit
    this.submitted = false;
  }


  ////#region rrc work

  positionSuccess(msg) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      text: msg,
      showConfirmButton: false,
      timer: 3000
    });
  }

  positionError(msg) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      text: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }

  addEvent(): void {

    this.responseData = new EntityOperationResult();
    this.editCalendarInfo = new EditCalendarInfo();
    this.editCalendarInfo.start = new Date(this.viewDate);
    this.editCalendarInfo.id = 0;
    this.editCalendarInfo.title = "Available";
    this.hidden = true;
    this.modalService.open(this.addUserModel);

  }

  Cancel() {
    this.modalEdit.hide();
  }

  Save(item) {

    item.multipartdate = this.betweenDate;
    if (item.multipartdate == 'undefined') {
      this.positionError("Please select Date");
      return;
    }


    var ForSaveItem = {
      startenddate: this.betweenDate.toString(),
      title: item.title
    };

    this.asrService.addAssesorEvnt(ForSaveItem).subscribe(data => {
      if (data.isSuccess == true) {
        this.positionSuccess(data.message);
        // this.responseData.good = "Successfully Added Dates: " + data.good;
        // if (data.bad){
        //   this.responseData.bad = "These Dates already marked: " + data.bad;
        // }

        this.events.splice(0, this.events.length);
        this.pageLoad_new();
        this.events;
        this.modalService.dismissAll();

      }
      else {
        if (data.message.toLowerCase() == 'already exist') {
          this.positionSuccess('Successfully Date Added')
        }
        else {
          this.positionError(data.message);
        }

        // this.responseData.bad = "These Dates already marked: " + data.bad;

        this.events.splice(0, this.events.length);
        this.modalService.dismissAll();
        this.pageLoad_new();
        setTimeout(() => {
          // this.addUserModel.hide();
        }, 5000);

      }
    },
      error => {

        console.log(JSON.stringify(error));
        this.positionError(error.error.message);

      });
    // this.events.splice(0, this.events.length);


  }

  Update(item) {
    var date = new Date(item.start);

    var ForUpdateItem = {
      id: item.id,
      start: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      title: item.title
    };

    // this.http.post<EntityOperationResult>(this.rootUrl + 'assessors/' + this.assessorId + '/Calendar', ForUpdateItem).subscribe(data => {

    //   if (data.isSuccess == true) {
    //     this.positionSuccess(data.message);        
    //     var curItem = this.events.find(x => x.id == item.id);
    //     curItem.title = item.title;
    //     curItem.start = startOfDay(parseISO(item.start)); //vk

    //     this.refresh.next();
    //     this.modalEdit.hide();


    //   }
    //   else {
    //     this.showError(data.error);
    //     this.progress = false;

    //   }
    // }, error => {
    //   console.log(JSON.stringify(error));

    //   this.showError(error.error.message);
    //   this.progress = false;
    // });


  }

  ////#endregion


} // ends export


export interface CalendarEvent<MetaType = any> {
  id?: string | number;
  // start: Date;
  date: Date;
  end?: Date;
  title: string;
  // actions?: EventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
}
export interface EventColor {
  primary: string;
  secondary: string;
}
export interface WeekDay {
  date: Date;
  day: number;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
  cssClass?: string;
}
export interface MonthViewDay<MetaType = any> extends WeekDay {
  inMonth: boolean;
  events: CalendarEvent[];
  backgroundColor?: string;
  badgeTotal: number;
  meta?: MetaType;
}
export interface MonthView {
  rowOffsets: number[];
  days: MonthViewDay[];
  totalDaysVisibleInWeek: number;
  period: ViewPeriod;
}
export interface ViewPeriod {
  start: Date;
  end: Date;
  events: CalendarEvent[];
}