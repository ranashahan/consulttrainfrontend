import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { apiCategoryModel } from '../../model/Category';
import { Subscription } from 'rxjs';
import { apiGenericModel } from '../../model/Generic';
import { apiTrainerModel } from '../../model/Trainer';
import { AssessmentService } from '../../services/assessment.service';
import { TrainerService } from '../../services/trainer.service';
import { LocationService } from '../../services/location.service';
import { ResultService } from '../../services/result.service';
import { TitleService } from '../../services/title.service';
import { StageService } from '../../services/stage.service';
import { VehicleService } from '../../services/vehicle.service';
import { ContractorService } from '../../services/contractor.service';
import { apiContractorModel } from '../../model/Contractor';
import { apiAssessmentModel, apiSessionModel } from '../../model/Assessment';
import { AlertComponent } from '../../widget/alert/alert.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-assessmentdetail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AlertComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './assessmentdetail.component.html',
  styleUrl: './assessmentdetail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentdetailComponent implements OnInit, OnDestroy {
  sessionID: number = 0;
  sessionDetail = signal<apiSessionModel[]>([]);
  assessmentForm: FormGroup;
  formDriver: FormGroup;
  contractors = signal<apiContractorModel[]>([]);
  clients: string = '';
  trainers = signal<apiTrainerModel[]>([]);
  titles = signal<apiGenericModel[]>([]);
  locations = signal<apiGenericModel[]>([]);
  stages = signal<apiGenericModel[]>([]);
  results = signal<apiGenericModel[]>([]);
  vehicles = signal<apiGenericModel[]>([]);
  isLoading = true;
  isAlert: boolean = false;
  alertType = '';
  successMessage = '';
  initialFormData: any;
  initialSessionData: any;
  categories: apiCategoryModel[] = [];
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: UtilitiesService,
    private cService: ContractorService,
    private assessmentService: AssessmentService,
    private trainerService: TrainerService,
    private locationService: LocationService,
    private resultService: ResultService,
    private titleService: TitleService,
    private stageService: StageService,
    private vehicleService: VehicleService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private driverService: DriverService
  ) {
    this.sessionID = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
    console.log('this is my sessionid: ' + this.sessionID);

    this.utils.setTitle('Assessment Details');
    this.assessmentForm = this.fb.group({});
    this.formDriver = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      nic: [{ value: '', disabled: true }, Validators.required],
      nicexpiry: [{ value: '', disabled: true }, Validators.required],
      dob: [{ value: '', disabled: true }, Validators.required],
      age: [{ value: '', disabled: true }, Validators.required],
      permitnumber: [{ value: '', disabled: true }, Validators.required],
      permitexpiry: [{ value: '', disabled: true }, Validators.required],
      licensenumber: [{ value: '', disabled: true }, Validators.required],
      licenseexpiry: [{ value: '', disabled: true }, Validators.required],
      contractorid: [{ value: '', disabled: true }, Validators.required],
      clientnames: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getContractors();
    this.getLocations();
    this.getVehicles();
    this.getTrainers();
    this.getResults();
    this.getStages();
    this.getTitles();
    this.getAllAssessments();
  }
  getSessionByID() {
    this.subscriptionList.push(
      this.assessmentService
        .getSessionbyID(this.sessionID)
        .subscribe((res: any) => {
          this.sessionDetail.set(res[0]);
          this.initialSessionData = this.sessionDetail();
          this.getDriver(res[0].driverid);
        })
    );
  }

  /**
   * This method will get driver against driver id
   */
  getDriver(id: number) {
    this.subscriptionList.push(
      this.driverService.getDriverByID(id).subscribe((driverData: any) => {
        // this.driver = driverData[0];
        this.formDriver.patchValue(driverData[0]);
      })
    );
  }
  getAllAssessments(): void {
    this.subscriptionList.push(
      this.assessmentService.getAllAssessments().subscribe((res: any) => {
        this.categories = res;
        this.createForm();
        this.getSessionByID();
        this.initialFormData = this.assessmentForm.value;
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
  getClientNamesByContractorId(contractorId: number): void {
    const contractor = this.contractors().find(
      (contractor) => contractor.id === contractorId
    );
    this.clients = contractor?.clientnames ?? '';
  }
  getTrainers() {
    this.subscriptionList.push(
      this.trainerService.getAllTrainers().subscribe((res: any) => {
        this.trainers.set(res);
      })
    );
  }
  getLocations() {
    this.subscriptionList.push(
      this.locationService.getAllLocations().subscribe((res: any) => {
        this.locations.set(res);
      })
    );
  }
  getStages() {
    this.subscriptionList.push(
      this.stageService.getAllStages().subscribe((res: any) => {
        this.stages.set(res);
      })
    );
  }
  getResults() {
    this.subscriptionList.push(
      this.resultService.getAllResults().subscribe((res: any) => {
        this.results.set(res);
      })
    );
  }
  getVehicles() {
    this.subscriptionList.push(
      this.vehicleService.getAllVehicles().subscribe((res: any) => {
        this.vehicles.set(res);
      })
    );
  }
  getTitles() {
    this.subscriptionList.push(
      this.titleService.getAllTitles().subscribe((res: any) => {
        this.titles.set(res);
      })
    );
  }

  createForm(): void {
    this.assessmentForm = this.fb.group({
      sessionName: ['', Validators.required],
      sessionDate: [null, Validators.required],
      classdate: [null],
      yarddate: [null],
      trainer: ['', Validators.required],
      stageId: [],
      titleId: [],
      resultId: [],
      locationId: [],
      vehicleId: [],
      route: [],
      traffic: [],
      weather: [],
      categories: this.fb.array(
        this.categories.map((category: apiCategoryModel) =>
          this.fb.group({
            id: [category.id],
            selected: [false],
            assessments: this.fb.array(
              // Ensure the 'assessments' FormArray is initialized
              category.assessments.map((assessment: apiAssessmentModel) =>
                this.fb.group({
                  id: [assessment.id || 0],
                  name: [assessment.name || ''],
                  initials: [assessment.initials || ''],
                  scoreInitial: [null],
                  scoreMiddle: [null],
                  scoreFinal: [null],
                })
              )
            ),
          })
        )
      ),
    });
    setTimeout(() => {
      this.isLoading = false; // Hide loader when data is loaded
      this.cdRef.detectChanges();
    }, 1000);
  }

  createCategoryForm(category: any): FormGroup {
    return this.fb.group({
      selected: [category.selected],
      assessments: this.fb.array(
        category.assessments.map((assessment: any) =>
          this.createAssessmentForm(assessment)
        )
      ),
    });
  }

  getAssessments(category: AbstractControl) {
    return category.get('assessments') as FormArray;
  }
  createAssessmentForm(assessment: any): FormGroup {
    return this.fb.group({
      name: [assessment.name],
      scoreInitial: [assessment.scoreInitial],
      scoreMiddle: [assessment.scoreMiddle],
      scoreFinal: [assessment.scoreFinal],
    });
  }

  get controls() {
    return (this.assessmentForm.get('categories') as FormArray)?.controls;
  }

  get categoriesArray(): FormArray {
    return this.assessmentForm.get('categories') as FormArray;
  }

  toggleCategory(index: number): void {
    const categoryControl = this.categoriesArray.at(index) as FormGroup;
    const selected = categoryControl.get('selected')?.value;
    console.log(`Category at index ${index} selected: ${selected}`);
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
