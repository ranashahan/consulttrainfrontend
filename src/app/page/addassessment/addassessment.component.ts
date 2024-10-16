import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { DriversearchComponent } from '../../widget/driversearch/driversearch.component';
import { UtilitiesService } from '../../services/utilities.service';
import { apiGenericModel } from '../../model/Generic';
import { apiContractorModel } from '../../model/Contractor';
import { BloodgroupService } from '../../services/bloodgroup.service';
import { DltypeService } from '../../services/dltype.service';
import { ContractorService } from '../../services/contractor.service';
import { AssessmentService } from '../../services/assessment.service';
import { apiCategoryModel } from '../../model/Category';
import { apiAssessmentModel } from '../../model/Assessment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TrainerService } from '../../services/trainer.service';
import { LocationService } from '../../services/location.service';
import { ResultService } from '../../services/result.service';
import { TitleService } from '../../services/title.service';
import { StageService } from '../../services/stage.service';
import { VehicleService } from '../../services/vehicle.service';
import { MatSelectModule } from '@angular/material/select';
import { apiTrainerModel } from '../../model/Trainer';
import { VisualService } from '../../services/visual.service';
import { map, Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../../widget/alert/alert.component';
@Component({
  selector: 'app-addassessment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DriversearchComponent,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
    AlertComponent,
  ],
  templateUrl: './addassessment.component.html',
  styleUrl: './addassessment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddassessmentComponent implements OnInit, OnDestroy {
  assessmentForm: FormGroup;
  formDriver: FormGroup;
  // bloodgroups = signal<apiGenericModel[]>([]);
  bloodGroups$: Observable<apiGenericModel[]> = new Observable<
    apiGenericModel[]
  >();
  visuals$: Observable<apiGenericModel[]> = new Observable<apiGenericModel[]>();
  dltypes$: Observable<apiGenericModel[]> = new Observable<apiGenericModel[]>();

  contractors = signal<apiContractorModel[]>([]);
  clients: string = '';
  trainers = signal<apiTrainerModel[]>([]);
  titles = signal<apiGenericModel[]>([]);
  locations = signal<apiGenericModel[]>([]);
  stages = signal<apiGenericModel[]>([]);
  results = signal<apiGenericModel[]>([]);
  vehicles = signal<apiGenericModel[]>([]);
  isLoading = true;
  subscriptionList: Subscription[] = [];
  isAlert: boolean = false;
  alertType = '';
  successMessage = '';

  @ViewChild(DriversearchComponent)
  driverSearchComponent!: DriversearchComponent;
  initialFormData: any;
  categories: apiCategoryModel[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: UtilitiesService,
    private bgService: BloodgroupService,
    private dltypeService: DltypeService,
    private cService: ContractorService,
    private visualService: VisualService,
    private assessmentService: AssessmentService,
    private trainerService: TrainerService,
    private locationService: LocationService,
    private resultService: ResultService,
    private titleService: TitleService,
    private stageService: StageService,
    private vehicleService: VehicleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.utils.setTitle('Add Assessment');
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
      licensetypeid: [{ value: '', disabled: true }, Validators.required],
      contractorid: [{ value: '', disabled: true }, Validators.required],
      bloodgroupid: [{ value: '', disabled: true }, Validators.required],
      visualid: [{ value: '', disabled: true }, Validators.required],
      clientnames: [{ value: '', disabled: true }, Validators.required],
    });
  }
  ngOnInit(): void {
    // this.getBloodGroups();
    // this.getDLTypes();
    this.getContractors();
    // this.getVisuals();
    this.getLocations();
    this.getVehicles();
    this.getTrainers();
    this.getResults();
    this.getStages();
    this.getTitles();
    this.getAllAssessments();
  }

  getAllAssessments(): void {
    this.subscriptionList.push(
      this.assessmentService.getAllAssessments().subscribe((res: any) => {
        this.categories = res;
        this.createForm();
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

  // Open the search modal
  openSearchModal() {
    this.bloodGroups$ = this.bgService.getAllBloodgroups().pipe(
      map((data: any) => {
        return data;
      })
    );

    this.visuals$ = this.visualService.getAllVisuals().pipe(
      map((data: any) => {
        return data;
      })
    );

    this.dltypes$ = this.dltypeService.getAllDLTypes().pipe(
      map((data: any) => {
        return data;
      })
    );

    this.driverSearchComponent.openModal(); // Call method to show the modal
  }

  // Capture the selected driver ID
  onDriverSelected(driver: object) {
    this.formDriver.patchValue(driver);
    this.getClientNamesByContractorId(
      this.formDriver.get('contractorid')?.value
    );
    this.formDriver.get('clientnames')?.setValue(this.clients);
  }

  insertAssessment(): void {
    var driverId = this.formDriver.get('id')?.value;
    var vCategories: apiCategoryModel[] = this.assessmentForm.value.categories;
    console.log(vCategories);
    var checkAssessment: boolean = this.checkAssessments(vCategories);
    console.log(checkAssessment);
    if (!driverId) {
      if (this.isAlert) {
        this.isAlert = false;
      }
      this.successMessage =
        'Assessment could not be submitted without Driver, Please select driver first!';
      this.alertType = 'danger';
      this.isAlert = true;
    } else if (!checkAssessment) {
      if (this.isAlert) {
        this.isAlert = false;
      }
      this.successMessage =
        'Assessment data are mandatory, please submit at least one score';
      this.alertType = 'danger';
      this.isAlert = true;
    } else {
      this.subscriptionList.push(
        this.assessmentService
          .createAssessment(driverId, this.assessmentForm.value)
          .subscribe({
            next: (data) => {
              if (this.isAlert) {
                this.isAlert = false;
              }
              this.successMessage = 'DDC form has been inserted successfully!';
              this.alertType = 'success';
              this.isAlert = true;
              this.resetForm();
              this.cdRef.detectChanges();
            },
            error: (err) => {
              if (this.isAlert) {
                this.isAlert = false;
              }
              this.successMessage = err.message;
              this.alertType = 'danger';
              this.isAlert = true;
              this.cdRef.detectChanges();
            },
          })
      );
    }
  }

  checkAssessments(categories: apiCategoryModel[]): boolean {
    return categories.some((category) =>
      category.assessments.some(
        (assessment) =>
          assessment.scoreInitial !== null ||
          assessment.scoreMiddle !== null ||
          assessment.scoreFinal !== null
      )
    );
  }
  resetForm(): void {
    this.formDriver.reset();
    this.assessmentForm.reset(this.initialFormData); // Reset form to initial state
    this.assessmentForm.markAsPristine(); // Optional: mark form as pristine
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((item) => {
      item.unsubscribe();
    });
  }
}
