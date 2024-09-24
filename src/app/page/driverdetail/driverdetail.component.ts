import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiDriverModel } from '../../model/Driver';
import { BloodgroupService } from '../../services/bloodgroup.service';
import { apiGenericModel } from '../../model/Generic';
import { ContractorService } from '../../services/contractor.service';
import { DltypeService } from '../../services/dltype.service';
import { apiContractorModel } from '../../model/Contractor';
import { UtilitiesService } from '../../services/utilities.service';
import { AlertComponent } from '../../widget/alert/alert.component';

@Component({
  selector: 'app-driverdetail',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent,
  ],
  templateUrl: './driverdetail.component.html',
  styleUrl: './driverdetail.component.css',
})
export class DriverdetailComponent implements OnInit {
  driverId: number = 0;
  driver: apiDriverModel = <apiDriverModel>{};
  isEdit = false;
  driverForm!: FormGroup;
  bloodgroups: apiGenericModel[] = [];
  dltypes: apiGenericModel[] = [];
  contractors: apiContractorModel[] = [];

  isAlert: boolean = false;
  alertType = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private driverService: DriverService,
    private bgService: BloodgroupService,
    private cService: ContractorService,
    private dltypeService: DltypeService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Driver details');
    // Get the ID from the route
    this.driverId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.driverForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Always disabled
      name: [{ value: '', disabled: !this.isEdit }],
      dob: [{ value: '', disabled: !this.isEdit }],
      nic: [{ value: '', disabled: !this.isEdit }],
      licensenumber: [{ value: '', disabled: !this.isEdit }],
      licensetypeid: [{ value: '', disabled: !this.isEdit }],
      licenseexpiry: [{ value: '', disabled: !this.isEdit }],
      designation: [{ value: '', disabled: !this.isEdit }],
      department: [{ value: '', disabled: !this.isEdit }],
      permitnumber: [{ value: '', disabled: !this.isEdit }],
      permitissue: [{ value: '', disabled: !this.isEdit }],
      permitexpiry: [{ value: '', disabled: !this.isEdit }],
      bloodgroupid: [{ value: '', disabled: !this.isEdit }],
      contractorid: [{ value: '', disabled: !this.isEdit }],
      formcount: [{ value: 0, disabled: !this.isEdit }],
      createdby: [{ value: '', disabled: true }],
    });
    // Fetch the driver details using the ID
    if (this.driverId) {
      this.getDriver();
    }
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

  getDriver() {
    this.driverService
      .getDriverByID(this.driverId)
      .subscribe((driverData: any) => {
        this.driver = driverData[0];
        this.driverForm.patchValue(driverData[0]);
      });
  }

  updateDriver() {
    if (this.driverForm.valid) {
      let updatedDriver = this.driverForm.getRawValue();
      if (updatedDriver.dob) {
        updatedDriver.dob = this.utils.convertToMySQLDate(updatedDriver.dob);
      }
      if (updatedDriver.licenseexpiry) {
        updatedDriver.licenseexpiry = this.utils.convertToMySQLDate(
          updatedDriver.licenseexpiry
        );
      }
      if (updatedDriver.permitissue) {
        updatedDriver.permitissue = this.utils.convertToMySQLDate(
          updatedDriver.permitissue
        );
      }

      if (updatedDriver.permitexpiry) {
        updatedDriver.permitexpiry = this.utils.convertToMySQLDate(
          updatedDriver.permitexpiry
        );
      }

      this.driverService
        .updatedriver(
          updatedDriver.id,
          updatedDriver.name,
          updatedDriver.dob,
          updatedDriver.nic,
          updatedDriver.licensenumber,
          updatedDriver.licensetypeid,
          updatedDriver.licenseexpiry,
          updatedDriver.designation,
          updatedDriver.department,
          updatedDriver.permitnumber,
          updatedDriver.permitissue,
          updatedDriver.permitexpiry,
          updatedDriver.bloodgroupid,
          updatedDriver.contractorid,
          updatedDriver.formcount
        )
        .subscribe((res: any) => {
          this.successMessage = 'Driver updated successfully';
          this.alertType = 'success';
          this.isAlert = true;
        });
    }
  }

  toggleEdit(): void {
    if (this.isEdit) {
      console.log(this.driverForm.get('id')?.value);
      this.updateDriver();
    }
    this.isEdit = !this.isEdit;

    // Enable or disable all fields except 'id'
    Object.keys(this.driverForm.controls).forEach((field) => {
      if (field !== 'id' && field !== 'createdby') {
        const control = this.driverForm.get(field);
        if (this.isEdit) {
          control?.enable(); // Enable fields when in edit mode
        } else {
          control?.disable(); // Disable fields when not in edit mode
        }
      }
    });
  }

  // Reset form to initial values (optional)
  resetForm(): void {
    this.driverForm.reset();
    this.getDriver(); // Re-load initial data to reset the form
  }
}
