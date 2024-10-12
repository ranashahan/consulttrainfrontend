import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { BloodgroupService } from '../../services/bloodgroup.service';
import { DltypeService } from '../../services/dltype.service';
import { ContractorService } from '../../services/contractor.service';
import { apiGenericModel } from '../../model/Generic';
import { UtilitiesService } from '../../services/utilities.service';
import { apiContractorModel } from '../../model/Contractor';
import { AlertComponent } from '../../widget/alert/alert.component';
import { VisualService } from '../../services/visual.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adddriver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './adddriver.component.html',
  styleUrl: './adddriver.component.css',
})
export class AdddriverComponent implements OnInit, OnDestroy {
  formDriver: FormGroup;

  contractors = signal<apiContractorModel[]>([]);
  bloodgroups = signal<apiGenericModel[]>([]);
  dltypes = signal<apiGenericModel[]>([]);
  visuals = signal<apiGenericModel[]>([]);

  isAlert: boolean = false;
  alertType = '';
  successMessage = '';

  subscriptionList: Subscription[] = [];

  constructor(
    private dService: DriverService,
    private utils: UtilitiesService,
    private bgService: BloodgroupService,
    private dltypeService: DltypeService,
    private cService: ContractorService,
    private vService: VisualService,
    private fb: FormBuilder
  ) {
    utils.setTitle('Add Driver');
    this.formDriver = this.fb.group({
      name: ['', Validators.required],
      dob: [null],
      nic: ['', Validators.required],
      nicexpiry: [null],
      licensenumber: ['', Validators.required],
      licensetypeid: [null],
      licenseexpiry: [null],
      designation: [''],
      department: [''],
      permitnumber: [''],
      permitissue: [null],
      bloodgroupid: [null],
      contractorid: [null],
      visualid: [null],
      ddccount: [0],
      experience: [0],
      comment: [''],
    });
  }
  ngOnInit(): void {
    this.getBloodGroups();
    this.getDLTypes();
    this.getContractors();
    this.getVisuals();
  }

  getBloodGroups() {
    this.subscriptionList.push(
      this.bgService.getAllBloodgroups().subscribe((res: any) => {
        this.bloodgroups.set(res);
      })
    );
  }
  getVisuals() {
    this.subscriptionList.push(
      this.vService.getAllVisuals().subscribe((res: any) => {
        this.visuals.set(res);
      })
    );
  }

  getDLTypes() {
    this.subscriptionList.push(
      this.dltypeService.getAllDLTypes().subscribe((res: any) => {
        this.dltypes.set(res);
      })
    );
  }

  getContractors() {
    this.subscriptionList.push(
      this.cService.getAllContractors().subscribe((res: any) => {
        this.contractors.set(res);
      })
    );
  }

  formReset() {
    this.formDriver.reset();
    //this.isAlert = false;
  }

  createDriver() {
    this.subscriptionList.push(
      this.dService
        .createDriver(
          this.formDriver.value.name,
          this.formDriver.value.dob,
          this.formDriver.value.nic,
          this.formDriver.value.nicexpiry,
          this.formDriver.value.licensenumber,
          this.formDriver.value.licensetypeid,
          this.formDriver.value.licenseexpiry,
          this.formDriver.value.designation,
          this.formDriver.value.department,
          this.formDriver.value.permitnumber,
          this.formDriver.value.permitissue,
          this.formDriver.value.bloodgroupid,
          this.formDriver.value.contractorid,
          this.formDriver.value.visualid,
          this.formDriver.value.ddccount,
          this.formDriver.value.experience,
          this.formDriver.value.comment
        )
        .subscribe({
          next: (data) => {
            if (this.isAlert) {
              this.isAlert = false;
            }
            this.successMessage = data.message.toString();
            this.alertType = 'success';
            this.isAlert = true;
            this.formReset();
          },
          error: (err) => {
            if (this.isAlert) {
              this.isAlert = false;
            }
            this.successMessage = err.message;
            this.alertType = 'danger';
            this.isAlert = true;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
