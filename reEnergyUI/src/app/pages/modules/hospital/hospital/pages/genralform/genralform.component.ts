import { Component, OnInit, AfterViewInit, ViewChild, Type, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import bsCustomFileInput from 'bs-custom-file-input';
import { AuthenticationService } from '../../../../../../core/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralForm, SplitLocation, GeneralinfoSection, GeneralinfoSectionQuestionBank, GeneralInfo } from '../../../../../model/hospital/GereralForm.model';
import Swal from 'sweetalert2';
import { HospitalPages, HospitalPagesQuestionBank } from '../../../../../model/hospital/HospitalPages.model';
import { BasicCertification } from 'src/app/account/auth/basic-certification/basic-Certification.component';
import { User } from '../../../../../model/User.model';
// import { threadId } from 'worker_threads';
import { barChart } from '../../../../../chart/echart/data';
import { NgbModal, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { HospitalDataShareService } from '../../datashareservice/hospitalDataShare.service';
import { FileUploadService } from 'src/app/pages/api-services/fileupload.service';
import { CustomTosterServiceService } from 'src/app/customtoster-service/customTosterService.service';
import { FileViewOrDelete } from 'src/app/pages/model/FileViewOrDelete.model';


@Component({
  selector: 'app-genralform',
  templateUrl: './genralform.component.html',
  styleUrls: ['./genralform.component.scss', '../../hospital.component.scss']
})

export class GenralformComponent implements OnInit, AfterViewInit {
  // hospitalPages: HospitalPages;
  openById = {}
  basicCertInfo: BasicCertification;
  regitrarionInfo: Registraion;
  userinfo: User;
  // generalInfo:GeneralForm
  splitLocation: SplitLocation;
  //generalinfo: GeneralForm;
  currentUserLoginId: number = 0;
  currUsrRole: number;
  submitted: Boolean;

  // new assign
  generalinfoSection: GeneralinfoSection;
  hospitalPages: HospitalPages;
  hospitalPagesQueBank: HospitalPagesQuestionBank;
  generalinfo: GeneralinfoSection;
  currentYear: number = new Date().getFullYear();
  yearsList: Array<number> = [];
  geninfoformSubmitted = false;
  currentUploadObj: any;
  currentProp: any;
  public currentObj: any;
  public propertyname: any;
  public selectedFile: any;
  ary_uploadedDocs: FileViewOrDelete[] = new Array();
  @Output() deleteFile = new EventEmitter();
  @ViewChild('acc') accordion: NgbAccordion;

  @ViewChild('GeneralForm') GeneralForm: NgForm;
  ayushSystems: Array<any> = [

    { id: 0, name: 'Ayurveda', isselected: false },
    { id: 4, name: 'Yoga', isselected: false },
    { id: 1, name: 'Naturopathy', isselected: false },
    { id: 2, name: 'Unani', isselected: false },
    { id: 3, name: 'Siddha', isselected: false },
    { id: 4, name: 'Homeopathy', isselected: false },
    { id: 5, name: 'Sowa-Rigpa', isselected: false }
  ];
  locNumber: string = '';
  // genralform: GeneralForm;
  is_org_reg: string;
  under_which_org_reg: string;
  isStatus: boolean;
  ownership_type: string;
  org_already_emp: string;
  checked: string


  public splitlono: number;

  rootUrl: string; currentUser: any;
  tempassrlist: any[];
  fileToUpload: File;
  state = new Array<State>();
  district = new Array<District>();
  progress: number;
  showUploadMsg: boolean | null;
  @ViewChild('uploadDoc', { static: false }) UploadDoc: any;
  @ViewChild('myFileInput2') myfileVariable: ElementRef;
  @ViewChild('documentuploadModel', { static: false }) documentuploadModel: any;
  ncFormTabInfo: any;
  Stage_id: number;
  @Output() openNcModelTabControl = new EventEmitter();
  hidebtns = false;
  constructor(private hospdataserv: HospitalDataShareService, private uploadService: FileUploadService, private tostr: CustomTosterServiceService, private modalService: NgbModal, private formBuilder: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
    this.rootUrl = authenticationService.apiUrl;
    this.splitLocation = new SplitLocation();
    this.generalinfo = new GeneralinfoSection();
    this.generalinfo.generalInfo = new GeneralInfo()
    this.generalinfo.generalInfo.location.splitLocation = new Array<SplitLocation>();
    this.getStateList();

    //new     
    for (let i = 1950; i <= this.currentYear; i++) {
      this.yearsList.push(i);
    }
    this.hospitalPages = new HospitalPages();
    this.hospitalPagesQueBank = new HospitalPagesQuestionBank();

    this.hospdataserv.currentStage.subscribe(data => {

      this.Stage_id = data
    });
    this.hospdataserv.ncFormTabInfo.subscribe(value => {
      this.ncFormTabInfo = value;
    })

    this.hospdataserv.getData().subscribe(data => {




      if (data != null || data != undefined) {
        this.hospitalPages = data;
        this.generalinfo = this.hospitalPages.generalInfo;
        this.generalinfo.generalInfo.spoc_email
        this.generalinfo.organizationInformation.month_year_setup;
        this.GetOrgs();
        if (this.hospitalPages.generalInfo.generalInfo.location.splitLocation != undefined || this.hospitalPages.generalInfo.generalInfo.location.splitLocation != null) {
          if (this.hospitalPages.generalInfo.generalInfo.location.splitLocation.length > 0) {
            this.hospitalPages.generalInfo.generalInfo.location.splitLocation.forEach(data => {
              if (data.split_state != null) {
                this.http.get<any>(this.authenticationService.apiUrl + 'unauthorized/district/' + data.split_state).subscribe(res => {

                  data.district_list = res;



                }, error => {


                  console.log(error);
                });
              }
            })

          }

        }
      }


    });

    this.hospdataserv.getQuestionBankData().subscribe(data => {

      if (data != null || data != undefined) {

        this.hospitalPagesQueBank = data;





      }


    });

    this.hospdataserv.getFormSubmissionStatus().subscribe(data => {

      if (data != null || data != undefined) {

        this.geninfoformSubmitted = data;


      }


    });
    this.hospdataserv.getButtonsHide().subscribe(data => {

      if (data != null || data != undefined) {

        this.hidebtns = data;


      }


    });
    const currentUser = JSON.parse(localStorage.getItem('ayushCurrentUser'));
    this.currentUser = currentUser;
    this.currUsrRole = this.currentUser.roleId;


  }

  panelChange(event) {
    this.openById[event.panelId] = event.nextState;
  }

  getStateList() {

    this.http.get<any>(this.authenticationService.apiUrl + 'unauthorized/statelist', {}).subscribe(res => {

      this.state = res;


    }, error => {
      console.log(error);
    });
  }

  checkmonthdate() {
    var a = this.generalinfo.organizationInformation.month_year_setup;
    console.error(a, "DFM");
  }
  selectState(tab: SplitLocation) {

    this.http.get<any>(this.authenticationService.apiUrl + 'unauthorized/district/' + tab.split_state).subscribe(res => {

      tab.district_list = res;


    }, error => {


      console.log(error);
    });

  }
  splitLocChange() {
    this.generalinfo.generalInfo.location.split_loc_nos = null;

    this.changeLocationTab();
  }

  getStateWiseDistrictList(statecode) {

    this.http.get<any>(this.authenticationService.apiUrl + 'unauthorized/district/' + statecode).subscribe(res => {

      this.district = res;


    }, error => {


      console.log(error);
    });
  }


  changespoc2(event) {
    if (this.generalinfo.generalInfo.organizationhead.org_head_same_as_spoc == true) {
      this.generalinfo.generalInfo.organizationhead.spoc_name = this.generalinfo.generalInfo.spoc_name;
      this.generalinfo.generalInfo.organizationhead.spoc_email = this.generalinfo.generalInfo.spoc_email;
      this.generalinfo.generalInfo.organizationhead.spoc_desig = this.generalinfo.generalInfo.spoc_designtion;
      this.generalinfo.generalInfo.organizationhead.spoc_mob = this.generalinfo.generalInfo.spoc_mob;
    }
    else {
      this.generalinfo.generalInfo.organizationhead.spoc_name = null;
      this.generalinfo.generalInfo.organizationhead.spoc_email = null;
      this.generalinfo.generalInfo.organizationhead.spoc_desig = null;
      this.generalinfo.generalInfo.organizationhead.spoc_mob = null;
    }
  }
  onlyDecimal(event) {

    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 46);
  }
  onlyNumberKey(event) {

    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;

  }
  onlyAphaKey(event) {

    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 97 && event.charCode <= 122 || event.charCode == 32 || event.charCode == 46
      || event.charCode == 45);
  }
  splitLocationNumberKey(event) {

    if (event.charCode == 8 || event.charCode == 0) {
      return null;
    }
    else if (event.charCode > 51) {
      return false;
    }
    else if (event.charCode >= 49 && event.charCode <= 51) {
      return true;
    }
    else {
      return false;
    }
  }
  landlineNumberKey(event) {

    if (event.charCode == 8 || event.charCode == 0) {
      return null;
    }

    else if ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 45)) {
      return true;
    }
    else {
      return false;
    }
  }
  GetOrgs() {


    this.tempassrlist = Array<Organization>();

    if (this.generalinfo.basicCertification.ayush_system != null || this.generalinfo.basicCertification.ayush_system != undefined) {

      var strArr = this.generalinfo.basicCertification.ayush_system.split(',');
      var intArr = [];

      for (let i = 0; i < strArr.length; i++) {
        intArr.push(strArr[i]);
      }




      intArr.forEach(value => {


        this.ayushSystems.forEach(data => {
          if (value == data.name) {

            data.isselected = true;
          }
        })

      });
    }

    // console.log("------")
    // console.log(this.ayushSystems);


  }



  tempArr: any = { "Organization": [] };

  onChangeCategory(event, org: Organization) { // Use appropriate model type instead of any

    this.tempArr.Organization.push(org.name);

  }


  ngOnInit() {
    this.openById["static-1"] = true;

    const currentUser = JSON.parse(localStorage.getItem('ayushCurrentUser'));
    console.log(currentUser);
    this.currentUser = currentUser;
    bsCustomFileInput.init();
    this.hospitalPages = new HospitalPages();
    // this.generalinfo = new GeneralForm();
    this.showUploadMsg = null;
    this.progress = null;

    if (this.currentUser) {
      this.currentUserLoginId = this.currentUser.userid;
      this.currUsrRole = this.currentUser.roleId;

    }


  }

  openNcModel(objName, propName, quesObj: any) {
    this.openNcModelTabControl.emit({ ObjName: objName, propName: propName, quesObj })

  }

  ngAfterViewInit() {

  }
  locationChange(value) {

    let val = parseInt(value);
    if (val > 500) {
      Swal.fire({
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-primary btn-lg' },
        html: "<p style='color:red'>This Organisation will be assessed as a seperate entity</p>"
      }).then((result) => {
        if (result.isConfirmed) {

          this.generalinfo.generalInfo.location.splitLocation.forEach(element => {
            if (element.dist_frm_main_loc === value) {
              element.dist_frm_main_loc = null;
            }
          });

        }
      })
    }
  }



  Upload_old() {



    // this.selectedFile = event.target.files[0];

    if (this.selectedFile != null) {
      var isfound = this.checkImageFromate(this.selectedFile.name)
      if (isfound) {

        Swal.fire('Invalid file!! Only pdf can be uploaded')
        // this.selectedFile == "";
        return;
      }
      else
        if (this.selectedFile != null && this.selectedFile != undefined && this.selectedFile != '') {
          var reader = new FileReader()
          reader.readAsDataURL(this.selectedFile);
          reader.onload = () => {
            var temp = reader.result as String;


          }

        }


    }

  }



  /** Uploade Files ***/
  //#region  file upload
  previewImage(ref, files: FileList, obj, _propertyname) {


    const fileItem = files.item(0);
    //console.log("fileItem");
    //console.log(fileItem);

    this.selectedFile = fileItem;
    this.currentObj = obj;
    this.propertyname = _propertyname;


    this.Upload();
    ref.value = "";

  }

  Upload() {

    if (this.selectedFile == null) {

      Swal.fire("please select file");

      return;


    }
    if (this.selectedFile != null) {
      var isfound = this.uploadService.checkImageFromate1(this.selectedFile.name)
      if (isfound) {
        // this.fileUploadLadda = false;
        Swal.fire("", "<p style='font-size: 1.5em'> Invalid file!! Only pdf can be uploaded </p>");
        return;
      }

    }
    this.hospdataserv.setLoaderStatus(true);
    this.uploadService.fileUpload(this.selectedFile).subscribe(data => {
      if (data.body) {
        if (data.body.isSuccess) {

          this.currentObj[this.propertyname] == null || this.currentObj[this.propertyname] == undefined || this.currentObj[this.propertyname] == "" ? this.currentObj[this.propertyname] = data.body.message : this.currentObj[this.propertyname] = this.currentObj[this.propertyname] + data.body.message;
          this.tostr.success('File uploaded');
          this.selectedFile = null;
          this.hospdataserv.setLoaderStatus(false);
          // let tempp = this.ClinicalServiceForm.daignostic_services.labservice_ac_credited_url
          //console.log(this.ClinicalServiceForm);
        }
        else {
          this.tostr.error(data.body.message);
          this.selectedFile = null;
          this.hospdataserv.setLoaderStatus(false);
        }
      }

    }
      , error => {
        console.log(error);
        this.hospdataserv.setLoaderStatus(false);
      });

  }


  openUploadedDocsModal(viewmodel, obj, _propertyname) {

    this.currentObj = obj;
    this.propertyname = _propertyname;
    this.ary_uploadedDocs = [];
    if (obj[_propertyname] == null || obj[_propertyname] == "" || obj[_propertyname] == undefined) {
      this.tostr.warning("No document uploaded.");
      return;
    }
    var str_array = obj[_propertyname].split('||');

    if (str_array) {
      if (str_array.length > 1) {
        for (var i = 0; i < str_array.length; i++) {

          if (str_array[i] && str_array[i].length > 0) {
            let docCls = new FileViewOrDelete();

            docCls.fn = str_array[i].split('|')[0];
            docCls.orgfn = str_array[i].split('|')[1];
            this.ary_uploadedDocs.push(docCls);
          }

        }
      }
    }
    this.modalService.open(viewmodel, { size: 'md' });
  }


  downloadUploadFile(item) {
    var result = this.uploadService.downloadUploadedFile(item.orgfn);
    result.subscribe(res => {
      if (res.isSuccess == true) {
        window.open(res.message);
      }
      else {
        this.tostr.error(res.message);
      }
    }, error => {
      //console.log(error);
    })
  }

  deleteUploadFile(item) {

    // this.deleteFile.emit(-1);
    // if (this.scopeOfServiceformImageDeleteSuccess == false) {
    //   this.tostr.error("File not deleted plez try again");
    //   return;
    // }
    var result = this.uploadService.deleteUploadedFile(item.orgfn);
    result.subscribe(res => {
      //debugger
      if (res.isSuccess == true) {

        this.ary_uploadedDocs = this.ary_uploadedDocs.filter(objitem => objitem != item);//here current obj removed       
        var latestString = null;
        for (var i = 0; i < this.ary_uploadedDocs.length; i++) {
          latestString == null ? latestString = this.ary_uploadedDocs[i].fn + "|" + this.ary_uploadedDocs[i].orgfn + "||" : latestString += this.ary_uploadedDocs[i].fn + "|" + this.ary_uploadedDocs[i].orgfn + "||";
        }

        this.currentObj[this.propertyname] = latestString;
        this.deleteFile.emit(-1);
        this.tostr.success("Selected file has been deleted successfully");

      }
      else {
        this.tostr.error(res.message);
      }
    }, error => {
      console.log(error);
    })
  }
  //#endregion file upload

  /***End Region***/





  onFileChanged(file: FileList) {


    const fileItem = file.item(0);
    this.selectedFile = fileItem;

    this.Upload();







  }

  checkImageFromate(selectedFile): boolean {


    this.chekImageValidation(selectedFile)


    return this.isStatus;

  }

  chekImageValidation(selectedFile) {
    //console.log(fileNme);
    let fileName = selectedFile
    var png = "png";
    var jpeg = "jpeg";
    var jpg = "jpg";
    var pdf = "pdf";
    var xlsx = "xlsx";



    var fileExt = fileName.split(".");

    if (pdf.toLowerCase() == fileExt[1].toLowerCase()) {
      this.isStatus = false;

    } else {

      this.isStatus = true;

    }
  }


  AddSplitLocation() {

    this.generalinfo.generalInfo.location.splitLocation.push(new SplitLocation());
  }

  changeLocationTab() {

    if (this.generalinfo.generalInfo.location.split_loc_nos > 3) {
      return;
    }
    this.splitlono = this.generalinfo.generalInfo.location.split_loc_nos;
    this.generalinfo.generalInfo.location.splitLocation = new Array<SplitLocation>();
    for (let i = 0; i < this.splitlono; i++) {

      this.splitLocation = new SplitLocation();

      this.generalinfo.generalInfo.location.splitLocation.push(this.splitLocation);
    }
  }

  checkEmpnaelledNone() {
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.cghs = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.railways = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.ayushmanbharat = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.publichealthinsuranceschemes = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.echs = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.stategovernmenthealthscheme = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.others = false;
    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.other_scheme_organization_is_linked = null;


  }
  // checkEmpanelledOther()
  // {
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.cghs=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.railways=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.ayushmanbharat=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.publichealthinsuranceschemes=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.echs=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.stategovernmenthealthscheme=false;
  //   this.generalinfo.organizationInformation.organization_is_already_empanelled_with.none=false;
  //   //this.generalinfo.organizationInformation.organization_is_already_empanelled_with.others=false;
  // }
  checkEmpanelledOptions() {

    this.generalinfo.organizationInformation.organization_is_already_empanelled_with.none = false;
    // this.generalinfo.organizationInformation.organization_is_already_empanelled_with.others=false;
    // this.generalinfo.organizationInformation.organization_is_already_empanelled_with.other_scheme_organization_is_linked = null;

  }

  openDocModel(objName, propName) {
    this.currentObj = objName;
    this.propertyname = propName;
    this.showUploadMsg = null;
    this.progress = null;
    this.modalService.open(this.documentuploadModel, { size: 'md' });
  }

  handleFileInput(files: FileList) {
    const fileItem = files.item(0);
    this.selectedFile = fileItem;

  }

  Upload2(myFileInput) {
    // //debugger
    if (this.selectedFile == null) {

      Swal.fire("Please Select Document");
      // this.myfileVariable.nativeElement.value = null;
      myFileInput.value = "";
      return;


    }
    if (this.selectedFile != null) {
      if (this.selectedFile.size > 20000000) {
        Swal.fire("", "<p style='font-size: 1.5em'> Invalid file!! The maximum file size allowed in 20 MB. </p>");
        this.selectedFile = null;
        myFileInput.value = "";
        return;
      }
      var isfound = this.uploadService.checkImageFormat2(this.selectedFile.name)
      if (isfound) {
        // this.fileUploadLadda = false;
        Swal.fire("", "<p style='font-size: 1.5em'> Invalid file!! Only PDF, JPEG, JPG, PNG can be uploaded </p>");
        this.selectedFile = null;
        // this.myfileVariable.nativeElement.value = null;
        myFileInput.value = "";
        return;
      }


    }
    this.showUploadMsg = false;
    this.hospdataserv.setLoaderStatus(true);
    this.progress = 10; // starts spinner
    this.progress = 20; // sets progress bar to 50%

    this.uploadService.fileUpload(this.selectedFile).subscribe(data => {
      if (data.body) {

        if (data.body.isSuccess) {
          this.progress = 50;
          this.currentObj[this.propertyname] == null || this.currentObj[this.propertyname] == undefined || this.currentObj[this.propertyname] == "" ? this.currentObj[this.propertyname] = data.body.message : this.currentObj[this.propertyname] = this.currentObj[this.propertyname] + data.body.message;
          // this.tostr.success('File uploaded');
          this.hospdataserv.setLoaderStatus(false);
          this.progress = 100;
          this.showUploadMsg = true;

          // let tempp = this.ClinicalServiceForm.daignostic_services.labservice_ac_credited_url
          //console.log(this.ClinicalServiceForm);
          // starts spinner

          this.selectedFile = null;
          myFileInput.value = "";
          // this.myfileVariable.nativeElement.value = null;

        }
        else {
          this.showUploadMsg = null;
          this.tostr.error(data.body.message);


          this.selectedFile = null;
          myFileInput.value = "";

          this.hospdataserv.setLoaderStatus(false);

        }
      }

    }
      , error => {
        console.log(error);
        this.showUploadMsg = null;
        this.selectedFile = null;
        myFileInput.value = "";
        this.hospdataserv.setLoaderStatus(false);
      });

  }

}

class Organization {
  id: number;
  name: string;
  isselected?: boolean;
}

class Registraion {
  id: string;
  userid: string;
  organizationType: string;
  systems: string;

}
export interface AyushSystems {
  id: number;
  name: string;
  isselected: boolean;

}

export class Tab {
  public id: number;
  public title: string;
  public tabData: any;
  public active: boolean;
  public component: Type<any>;
  constructor(title: string, tabData: any) {
    this.tabData = tabData;
    // this.component = component;
    this.title = title;
  }
}

class State {
  id: number;
  statename: string;
  statecode: string;
  gstcode: string;
}

class District {
  id: number;
  districtname: string;
  statecode: string;
  gstcode: string;
}