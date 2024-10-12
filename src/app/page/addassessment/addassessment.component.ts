import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { map, Observable } from 'rxjs';
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
  ],
  templateUrl: './addassessment.component.html',
  styleUrl: './addassessment.component.css',
})
export class AddassessmentComponent implements OnInit {
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
    private vehicleService: VehicleService
  ) {
    utils.setTitle('Add Assessment');
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
    this.assessmentService.getAllAssessments().subscribe((res: any) => {
      this.categories = res;
      this.createForm();
      this.initialFormData = this.assessmentForm.value;
    });
  }

  // getBloodGroups(): void {
  //   this.bgService.getAllBloodgroups().subscribe((res: any) => {
  //     this.bloodgroups.set(res);
  //   });
  // }

  // getDLTypes(): void {
  //   this.dltypeService.getAllDLTypes().subscribe((res: any) => {
  //     this.dltypes.set(res);
  //   });
  // }
  // getVisuals(): void {
  //   this.visualService.getAllVisuals().subscribe((res: any) => {
  //     this.visuals.set(res);
  //   });
  // }
  getContractors() {
    this.cService.getAllContractors().subscribe((res: any) => {
      this.contractors.set(res);
    });
  }
  getClientNamesByContractorId(contractorId: number): void {
    const contractor = this.contractors().find(
      (contractor) => contractor.id === contractorId
    );
    this.clients = contractor?.clientnames ?? '';
  }
  getTrainers() {
    this.trainerService.getAllTrainers().subscribe((res: any) => {
      this.trainers.set(res);
    });
  }
  getLocations() {
    this.locationService.getAllLocations().subscribe((res: any) => {
      this.locations.set(res);
    });
  }
  getStages() {
    this.stageService.getAllStages().subscribe((res: any) => {
      this.stages.set(res);
    });
  }
  getResults() {
    this.resultService.getAllResults().subscribe((res: any) => {
      this.results.set(res);
    });
  }
  getVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res: any) => {
      this.vehicles.set(res);
    });
  }
  getTitles() {
    this.titleService.getAllTitles().subscribe((res: any) => {
      this.titles.set(res);
    });
  }

  createForm(): void {
    this.assessmentForm = this.fb.group({
      sessionName: ['', Validators.required],
      sessionDate: [null, Validators.required],
      classDate: [null],
      yardTestDate: [null],
      trainer: ['', Validators.required],
      stage: [],
      title: [],
      result: [],
      location: [],
      vehicle: [],
      route: [],
      roadTraffic: [],
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
    }, 2000);
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

  createAssessment(): void {
    console.log(this.assessmentForm.getRawValue());
    var driverID = this.formDriver.get('id')?.value;
    console.log('this is my driver ID: ' + driverID);
    var answerSessionName = this.assessmentForm.get('sessionName')?.value;
    console.log('this is my session name: ' + answerSessionName);
    var answerSessionDate = this.assessmentForm.get('sessionDate')?.value;
    console.log('this is my session date: ' + answerSessionDate);
    var answerClassDate = this.assessmentForm.get('classDate')?.value;
    console.log('this is my class date: ' + answerClassDate);
    var answerYardTestDate = this.assessmentForm.get('yardTestDate')?.value;
    console.log('this is my yard test date: ' + answerYardTestDate);
    var answerRoute = this.assessmentForm.get('route')?.value;
    console.log('this is my route: ' + answerRoute);
    var answerRoadTraffic = this.assessmentForm.get('roadTraffic')?.value;
    console.log('this is my road traffic: ' + answerRoadTraffic);
    var answerWeather = this.assessmentForm.get('weather')?.value;
    console.log('this is my weather: ' + answerWeather);
    var answerResultid = this.assessmentForm.get('result')?.value;
    console.log('this is my resultid: ' + answerResultid);
    var answerLocationid = this.assessmentForm.get('location')?.value;
    console.log('this is my location id: ' + answerLocationid);
    var answerStageid = this.assessmentForm.get('stage')?.value;
    console.log('this is my stage ID: ' + answerStageid);
    var answerTitleid = this.assessmentForm.get('title')?.value;
    console.log('this is my title ID: ' + answerTitleid);
    var answerVehicleid = this.assessmentForm.get('vehicle')?.value;
    console.log('this is my vehicle ID: ' + answerVehicleid);
    var answerTrainersIds = this.assessmentForm.get('trainer')?.value;
    console.log('this is my trainers ID: ' + answerTrainersIds);
    var answerCategories = this.assessmentForm.get('categories')?.value;
    console.log(answerCategories);
    this.resetForm();

    const jsonResult = this.convertCategoriesToJson(
      answerCategories,
      answerSessionDate
    );

    // Convert to JSON string if needed
    const jsonString = JSON.stringify(jsonResult, null, 2);
    console.log(jsonString);
  }

  resetForm(): void {
    this.formDriver.reset();
    this.assessmentForm.reset(this.initialFormData); // Reset form to initial state
    this.assessmentForm.markAsPristine(); // Optional: mark form as pristine
  }

  convertCategoriesToJson(categories: any[], sessionDate: string): any[] {
    const result: any[] = [];
    categories.forEach((category) => {
      category.assessments.forEach((assessment: apiAssessmentModel) => {
        if (assessment.scoreInitial !== null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Initial',
            score: assessment.scoreInitial,
            assessmentdate: sessionDate,
          });
        }

        if (assessment.scoreMiddle !== null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Middle',
            score: assessment.scoreMiddle,
            assessmentdate: sessionDate,
          });
        }

        if (assessment.scoreFinal !== null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Final',
            score: assessment.scoreFinal,
            assessmentdate: sessionDate,
          });
        }
      });
    });

    return result;
  }
}
