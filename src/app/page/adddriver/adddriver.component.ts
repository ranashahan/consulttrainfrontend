import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { apiDriverModel } from '../../model/Driver';
import { DriverService } from '../../services/driver.service';
import { BloodgroupService } from '../../services/bloodgroup.service';
import { DltypeService } from '../../services/dltype.service';
import { ContractorService } from '../../services/contractor.service';
import { apiGenericModel } from '../../model/Generic';
import { UtilitiesService } from '../../services/utilities.service';
import { apiContractorModel } from '../../model/Contractor';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertComponent } from '../../widget/alert/alert.component';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-adddriver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './adddriver.component.html',
  styleUrl: './adddriver.component.css',
})
export class AdddriverComponent implements OnInit {
  formDriver = new FormGroup({
    name: new FormControl(),
    dob: new FormControl(),
    nic: new FormControl(),
    licensenumber: new FormControl(),
    licensetypeid: new FormControl(),
    licenseexpiry: new FormControl(),
    designation: new FormControl(),
    department: new FormControl(),
    permitnumber: new FormControl(),
    permitissue: new FormControl(),
    bloodgroupid: new FormControl(),
    contractorid: new FormControl(),
    ddccount: new FormControl(),
    experience: new FormControl(),
  });

  contractors: apiContractorModel[] = [];
  bloodgroups: apiGenericModel[] = [];
  dltypes: apiGenericModel[] = [];

  isAlert: boolean = false;
  alertType = '';
  successMessage = '';
  // errorMessage = 'There was an error processing your request!';

  constructor(
    private dService: DriverService,
    private utils: UtilitiesService,
    private bgService: BloodgroupService,
    private dltypeService: DltypeService,
    private cService: ContractorService
  ) {}
  ngOnInit(): void {
    this.getBloodGroups();
    this.getDLTypes();
    this.getContractors();
  }

  getBloodGroups() {
    this.bgService.getAllBloodgroups().subscribe((res: any) => {
      this.bloodgroups = res;
    });
  }

  getDLTypes() {
    this.dltypeService.getAllDLTypes().subscribe((res: any) => {
      this.dltypes = res;
    });
  }

  getContractors() {
    this.cService.getAllContractors().subscribe((res: any) => {
      this.contractors = res;
    });
  }
  getBloodGroupName(bloodgroupId: number): string {
    return this.utils.getGenericName(this.bloodgroups, bloodgroupId);
  }
  getContractosName(contractorId: number): string {
    return this.utils.getGenericName(this.contractors, contractorId);
  }
  getDLTypesName(dltypeId: number): string {
    return this.utils.getGenericName(this.dltypes, dltypeId);
  }

  frmReset() {
    this.formDriver.reset();
    //this.isAlert = false;
  }

  createDriver() {
    this.dService
      .createDriver(
        this.formDriver.value.name,
        this.formDriver.value.dob,
        this.formDriver.value.nic,
        this.formDriver.value.licensenumber,
        this.formDriver.value.licensetypeid,
        this.formDriver.value.licenseexpiry,
        this.formDriver.value.designation,
        this.formDriver.value.department,
        this.formDriver.value.permitnumber,
        this.formDriver.value.permitissue,
        this.formDriver.value.bloodgroupid,
        this.formDriver.value.contractorid,
        this.formDriver.value.ddccount,
        this.formDriver.value.experience
      )
      .subscribe({
        next: (data) => {
          if (this.isAlert) {
            this.isAlert = false;
          }
          this.successMessage = data.id.toString();
          this.alertType = 'success';
          this.isAlert = true;
          this.frmReset();
        },
        error: (err) => {
          console.error('Error creating driver:', err.message); // Display the error message
          alert(err.message); // Optionally show it to the user via an alert or another UI element

          if (this.isAlert) {
            this.isAlert = false;
          }
          this.successMessage = err.message;
          this.alertType = 'danger';
          this.isAlert = true;
        },
      });
  }
  //     .subscribe((res: any) => {
  //       if (res) {
  //         if (this.isAlert) {
  //           this.isAlert = false;
  //         }
  //         this.successMessage = res.message;
  //         this.alertType = 'success';
  //         this.isAlert = true;
  //         this.frmReset();
  //       } else {
  //         if (this.isAlert) {
  //           this.isAlert = false;
  //         }
  //         this.successMessage =
  //           'Something wrong, please contact to system admin';
  //         this.alertType = 'danger';
  //         this.isAlert = true;
  //       }
  //     });
  //   console.log(this.formDriver.value);
  // }
}
