import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BloodgroupService } from '../../services/bloodgroup.service';
import { apiGenericModel } from '../../model/Generic';
import { ContractorService } from '../../services/contractor.service';
import { DltypeService } from '../../services/dltype.service';
import { apiContractorModel } from '../../model/Contractor';
import { UtilitiesService } from '../../services/utilities.service';
import { AlertComponent } from '../../widget/alert/alert.component';
import { VisualService } from '../../services/visual.service';
import { Subscription } from 'rxjs';

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
export class DriverdetailComponent implements OnInit, OnDestroy {
  driverId: number = 0;
  isEdit = false;
  driverForm!: FormGroup;
  bloodgroups = signal<apiGenericModel[]>([]);
  dltypes = signal<apiGenericModel[]>([]);
  visuals = signal<apiGenericModel[]>([]);
  contractors = signal<apiContractorModel[]>([]);

  isAlert: boolean = false;
  alertType = '';
  successMessage = '';
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param fb form group
   * @param route route
   * @param driverService driver service for api calls
   * @param bgService bloodgroup service for api calls
   * @param cService contractor service for api calls
   * @param dltypeService dltypes service for api calls
   * @param utils utilities service for set page title
   * @param vService visual service for api calls
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private driverService: DriverService,
    private bgService: BloodgroupService,
    private cService: ContractorService,
    private dltypeService: DltypeService,
    private utils: UtilitiesService,
    private vService: VisualService
  ) {}
  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Driver details');
    // Get the ID from the route
    this.driverId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.driverForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Always disabled
      name: [{ value: '', disabled: !this.isEdit }],
      dob: [{ value: null, disabled: !this.isEdit }],
      age: [{ value: '', disabled: !this.isEdit }],
      nic: [{ value: '', disabled: true }],
      nicexpiry: [{ value: null, disabled: !this.isEdit }],
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
      visualid: [{ value: '', disabled: !this.isEdit }],
      ddccount: [{ value: 0, disabled: !this.isEdit }],
      experience: [{ value: 0, disabled: !this.isEdit }],
      comment: [{ value: '', disabled: !this.isEdit }],
      createdby: [{ value: '', disabled: true }],
    });
    // Fetch the driver details using the ID
    if (this.driverId) {
      this.getDriver();
    }
    this.getBloodGroups();
    this.getDLTypes();
    this.getContractors();
    this.getVisuals();
  }
  /**
   * This method will get all the blood groups
   */
  getBloodGroups() {
    this.subscriptionList.push(
      this.bgService.getAllBloodgroups().subscribe((res: any) => {
        this.bloodgroups.set(res);
      })
    );
  }
  /**
   * This method will get all the driving license types
   */
  getDLTypes() {
    this.subscriptionList.push(
      this.dltypeService.getAllDLTypes().subscribe((res: any) => {
        this.dltypes.set(res);
      })
    );
  }
  /**
   * This method will get all the visuals
   */
  getVisuals() {
    this.subscriptionList.push(
      this.vService.getAllVisuals().subscribe((res: any) => {
        this.visuals.set(res);
      })
    );
  }

  /**
   * This method will get all the contractors
   */
  getContractors() {
    this.subscriptionList.push(
      this.cService.getAllContractors().subscribe((res: any) => {
        this.contractors.set(res);
      })
    );
  }
  /**
   * This method will set blood group name against blood group ID
   * @param itemId blood group ID
   * @returns string blood group name
   */
  getBloodGroupName(itemId: number): string {
    return this.utils.getGenericName(this.bloodgroups(), itemId);
  }
  /**
   * This method will set contractor name against contractor ID
   * @param itemId contractor ID
   * @returns string contractor name
   */
  getContractorName(itemId: number): string {
    return this.utils.getGenericName(this.contractors(), itemId);
  }
  /**
   * This method will set DLType name against DLType ID
   * @param itemId DLType ID
   * @returns string DLType name
   */
  getDLTypeName(itemId: number): string {
    return this.utils.getGenericName(this.dltypes(), itemId);
  }
  /**
   * This method will set visual name against visual ID
   * @param itemId visual ID
   * @returns string visual name
   */
  getVisualName(itemId: number): string {
    return this.utils.getGenericName(this.visuals(), itemId);
  }

  /**
   * This method will get driver against driver id
   */
  getDriver() {
    this.subscriptionList.push(
      this.driverService
        .getDriverByID(this.driverId)
        .subscribe((driverData: any) => {
          // this.driver = driverData[0];
          this.driverForm.patchValue(driverData[0]);
        })
    );
  }
  /**
   * This method will print the page
   */
  printPage(): void {
    window.print();
  }
  /**
   * This method will update driver against id
   */
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
      if (updatedDriver.nicexpiry) {
        updatedDriver.nicexpiry = this.utils.convertToMySQLDate(
          updatedDriver.nicexpiry
        );
      }

      if (updatedDriver.permitexpiry) {
        updatedDriver.permitexpiry = this.utils.convertToMySQLDate(
          updatedDriver.permitexpiry
        );
      }
      this.subscriptionList.push(
        this.driverService
          .updatedriver(
            updatedDriver.id,
            updatedDriver.name,
            updatedDriver.dob,
            updatedDriver.nic,
            updatedDriver.nicexpiry,
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
            updatedDriver.visualid,
            updatedDriver.ddccount,
            updatedDriver.experience,
            updatedDriver.comment
          )
          .subscribe((res: any) => {
            this.successMessage = 'Driver updated successfully';
            this.alertType = 'success';
            this.isAlert = true;
            this.getDriver();
          })
      );
    }
  }
  /**
   * This method will toggel the edit button
   */
  toggleEdit(): void {
    this.isEdit = !this.isEdit;
    // Enable or disable all fields except 'id'
    Object.keys(this.driverForm.controls).forEach((field) => {
      if (field !== 'id' && field !== 'age' && field !== 'createdby') {
        const control = this.driverForm.get(field);
        if (this.isEdit) {
          control?.enable(); // Enable fields when in edit mode
        } else {
          control?.disable(); // Disable fields when not in edit mode
        }
      }
    });
  }
  /**
   * This method will reset the form value to blank
   */
  resetForm(): void {
    this.driverForm.reset();
    this.getDriver();
  }
  /**
   * This method will destory all the subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
