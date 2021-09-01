import { Component, OnInit } from '@angular/core';
import { DateStruct } from 'src/app/pages/model/hospital/SupportService.model';
import { AdminService } from 'src/app/pages/api-services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AssessorService } from 'src/app/pages/api-services/assessor.service';
import { Router } from '@angular/router';
import { parseTwoDigitYear } from 'ngx-bootstrap/chronos/units/year';
import { formatDate } from '@angular/common';
import { FormBuilderDataShareService } from '../../formbuilder/datashareservices/FormBuilderDataShareService';
@Component({
  selector: 'app-da-oa-allocate',
  templateUrl: './da-oa-allocated-hosp.component.html',
  styleUrls: ['./da-oa-allocated-hosp.component.scss']
})
export class DaOaAllocatedHospComponent implements OnInit {
  hospitalList: DA_OA_AllocatedHospist
  stateDropdown: dropDownData[]
  stageDropdown: dropDownData[]
  StageDropDownData: dropDownData[]
  assessorDropdown: AssessorDetailForAllocation[]



  totalCount: number = 0;
  minCount: number = 1;
  maxCount: number = 10;
  skip: number = 0;
  public enties = [25, 50, 100, 200];

  SearchTerms: string = "";
  SearchState: number = 0;
  SearchType: string = null;
  SearchStage: number = 0;
  searchAssessmentType: number = null
  limit: number = 10;
  daalloc_loading = false
  current_hospid = 0;
  mobileOtp: string = null;
  currentUser: any;
  

  constructor(private router: Router, private formBuilderdataservc: FormBuilderDataShareService, private modalService: NgbModal, private adminService: AdminService, private assrService: AssessorService) {


    this.hospitalList = new DA_OA_AllocatedHospist();
    this.getDropDownData();

    this.currentUser = JSON.parse(localStorage.getItem('ayushCurrentUser'));

  }

  ngOnInit(): void {
  }
//#region rupendra
bulkPrichase(addBulkpurchasesModel){
  this.modalService.open(addBulkpurchasesModel, { size: 'lg' });
}
//#endregion rupendra
  getDropDownData() {
    this.assrService.getDaOaAllocatedHospDropdownList().subscribe(res => {

      this.stateDropdown = res.statedropdown;
      this.StageDropDownData = res.stagedropdown as dropDownData[]

      this.stageDropdown = this.StageDropDownData.filter(x => x.value == 40 || x.value == 45 || x.value == 50 || x.value == 60 || x.value == 70 || x.value == 80 || x.value == 90 || x.value == 100 || x.value == 110 || x.value == 112 || x.value == 113 || x.value == 114 || x.value == 115 || x.value == 120 || x.value == 130 || x.value == 140 || x.value == 150 || x.value == 160 || x.value == 170 || x.value == 180 || x.value == 190 || x.value == 200)



      this.getHospitalList()

    }, error => {
      console.log(error);
    });
  }
  AssmtTypeChange() {
    if (this.searchAssessmentType == 1) {
      this.stageDropdown = this.StageDropDownData.filter(x => x.value == 40 || x.value == 45 || x.value == 50 || x.value == 60 || x.value == 70 || x.value == 80 || x.value == 90 || x.value == 100)


    }
    else if (this.searchAssessmentType == 2) {
      this.stageDropdown = this.StageDropDownData.filter(x => x.value == 110 || x.value == 112 || x.value == 115 || x.value == 120 || x.value == 130 || x.value == 140 || x.value == 150 || x.value == 160 || x.value == 170 || x.value == 180 || x.value == 190 || x.value == 200)


    }
    else {
      this.stageDropdown = this.StageDropDownData;

    }

  }
  searchReset() {
    this.SearchTerms = "";
    this.SearchState = 0;
    this.SearchType = null;
    this.SearchStage = 0;

    this.searchAssessmentType = null

    this.limit = 10;
    this.getHospitalList();

  }
  openassessmentForm(data: Da_Oa_Allocated_Hosp_Dto) {

    // debugger
    // if (this.currentUser.id == data.assr_usrid) {
    //   return 0;
    // }
    this.formBuilderdataservc.setVendorDataAsr(data);
    this.router.navigateByUrl('onsiteassessment/assessmentDataFromMobile');



  }
  getHospitalList() {



    this.assrService.getDaOaAllocatedHosp(this.SearchTerms, this.SearchType, this.SearchState, this.searchAssessmentType, this.SearchStage, 0, this.limit).subscribe(res => {
      // var filtered = res.rows.filter((x => x.stage_id < 100))
      this.hospitalList = res;
      // this.hospitalList.rows = filtered;
      this.totalCount = this.hospitalList.total;
      console.log(res);

    }, error => {
      console.log(error);
    });

  }
  getHospitalListDa() {



    this.assrService.getDaAllocatedHosp(this.SearchTerms, this.SearchType, this.SearchState, this.searchAssessmentType, this.SearchStage, 0, this.limit).subscribe(res => {

      this.hospitalList = res;
      this.totalCount = this.hospitalList.total;
      console.log(res);

    }, error => {
      console.log(error);
    });

  }

  pageChanged(pageNo) {

    this.minCount = 1 + (this.limit * (pageNo - 1));
    this.maxCount = this.limit + (this.limit * (pageNo - 1));

    if (this.totalCount < this.maxCount) {
      this.maxCount = this.totalCount;
    }

    this.skip = ((pageNo - 1) * this.limit);
    this.assrService.getDaOaAllocatedHosp(this.SearchTerms, this.SearchType, this.SearchState, this.searchAssessmentType, this.SearchStage, this.skip, this.limit).subscribe(res => {

      this.hospitalList = res;
      console.log(res);

    }, error => {
      console.log(error);
    });


  }
  showEnteries() {
    this.skip = 0;
    this.getHospitalList();
  }

  reGenrateOtp() {
    this.assrService.genrateMobileOtp(this.current_hospid).subscribe(res => {

      if (res.isSuccess == false) {
        //this.loading=false;
        this.positionError(res.message)
        return;
      }
      this.positionSuccess("OTP Successfull Sent")





    }, error => {
      console.log(error);
    });
  }

  DA_Action(record: Da_Oa_Allocated_Hosp_Dto, otpVerifymodal: any, sorryModal: any) {

    const cValue = formatDate(record.assessment_date, 'yyyy-MM-dd', 'en');
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const currentDateRime = formatDate(new Date(), 'HH:MM:SS', 'en')
    if (currentDate < cValue) {
      this.modalService.open(sorryModal, { size: 'md' });
      return

    }
    if ((currentDateRime < '09:00:00') || (currentDateRime > '21:00:00')) {
      this.modalService.open(sorryModal, { size: 'md' });
      return

    }
    this.current_hospid = record.hosp_id;
    if (record.stage_id == 40) {
      //genrate_otp
      this.assrService.genrateMobileOtp(record.hosp_id).subscribe(res => {

        if (res.isSuccess == false) {
          //this.loading=false;
          this.positionError(res.message)
          return;
        }
        this.positionSuccess("Please Enter OTP Sent to Mobile Number")
        this.mobileOtp = null;
        this.modalService.open(otpVerifymodal, { size: 'md' });



      }, error => {
        console.log(error);
      });


    }
    else {



      if (record.type.trim() == 'Hospital') {


        this.router.navigateByUrl('assessment/hospitalapplication', { state: { uid: record.hosp_id } })
        //redirect to hospform
      }
      else if (record.type.trim() == 'Centre') {
        this.router.navigateByUrl('assessment/centerHospitalapplication', { state: { uid: record.hosp_id } })
      }

    }

  }

  verifyOtp() {
    this.current_hospid
    this.mobileOtp

    this.assrService.verifyMobileOtp(this.current_hospid, this.mobileOtp).subscribe(res => {

      if (res.isSuccess == false) {
        //this.loading=false;
        this.positionError(res.message)
        return;
      }
      this.modalService.dismissAll();
      this.positionSuccess("Otp Verified Successfully");
      this.getHospitalList();




    }, error => {
      console.log(error);
    });
  }
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


}
export class DA_OA_AllocatedHospist {
  current: number
  total: number
  rowCount: number
  rows: Da_Oa_Allocated_Hosp_Dto[]
}

export class Da_Oa_Allocated_Hosp_Dto {
  hosp_id: number
  reference_id: String
  org_name: String
  state_id: number
  state: String
  application_type: String
  application_no: String
  registration_date: Date
  assessment_date: Date
  stage: String
  type: String
  stage_id: number
  status: boolean
  current_da: string
  current_da_id: number
  assmt_type: string
  assr_usrid: number

}
class dropDownData {
  value: number
  text: String

}
class AssessorDetailForAllocation {
  assr_id: number
  assr_name: string

  qualification: string
  experience: number

  city: string
  district: string
  state: string
  specilities: string

  da_completed_count: number
}