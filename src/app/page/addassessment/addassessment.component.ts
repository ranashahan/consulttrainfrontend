import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { TrainerService } from '../../services/trainer.service';
import { LocationService } from '../../services/location.service';
import { ResultService } from '../../services/result.service';
import { TitleService } from '../../services/title.service';
import { StageService } from '../../services/stage.service';
import { VehicleService } from '../../services/vehicle.service';
import { MatSelectModule } from '@angular/material/select';
import { apiTrainerModel } from '../../model/Trainer';
import { VisualService } from '../../services/visual.service';
import { apiClientModel } from '../../model/Client';
import { ClientService } from '../../services/client.service';
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
  ],
  templateUrl: './addassessment.component.html',
  styleUrl: './addassessment.component.css',
})
export class AddassessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  formDriver: FormGroup;
  formGeneral: FormGroup;
  bloodgroups: apiGenericModel[] = [];
  dltypes: apiGenericModel[] = [];
  contractors: apiContractorModel[] = [];
  clients: string = '';
  visuals: apiGenericModel[] = [];
  trainers: apiTrainerModel[] = [];
  titles: apiGenericModel[] = [];
  locations: apiGenericModel[] = [];
  stages: apiGenericModel[] = [];
  results: apiGenericModel[] = [];
  vehicles: apiGenericModel[] = [];

  @ViewChild(DriversearchComponent)
  driverSearchComponent!: DriversearchComponent;
  initialFormData: any;
  categories: apiCategoryModel[] = [];

  constructor(
    private fb: FormBuilder,
    private Utils: UtilitiesService,
    private bgService: BloodgroupService,
    private dltypeService: DltypeService,
    private cService: ContractorService,
    private clientService: ClientService,
    private visualService: VisualService,
    private assessmentService: AssessmentService,
    private trainerService: TrainerService,
    private locationService: LocationService,
    private resultService: ResultService,
    private titleService: TitleService,
    private stageService: StageService,
    private vehicleService: VehicleService
  ) {
    Utils.setTitle('Add Assessment');
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

    this.formGeneral = this.fb.group({
      trainer: this.fb.array([]),
      stage: [],
      title: [],
      result: [],
      location: [],
    });

    Utils.setTitle('Add Assessment');
  }
  ngOnInit(): void {
    this.getBloodGroups();
    this.getDLTypes();
    this.getContractors();
    this.getVisuals();
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

  getBloodGroups(): void {
    this.bgService.getAllBloodgroups().subscribe((res: any) => {
      this.bloodgroups = res;
    });
  }

  getDLTypes(): void {
    this.dltypeService.getAllDLTypes().subscribe((res: any) => {
      this.dltypes = res;
    });
  }
  getVisuals(): void {
    this.visualService.getAllVisuals().subscribe((res: any) => {
      this.visuals = res;
    });
  }
  getContractors() {
    this.cService.getAllContractors().subscribe((res: any) => {
      this.contractors = res;
    });
  }

  getClientNamesByContractorId(contractorId: number): void {
    const contractor = this.contractors.find(
      (contractor) => contractor.id === contractorId
    );
    this.clients = contractor?.clientnames ?? '';
  }

  getTrainers() {
    this.trainerService.getAllTrainers().subscribe((res: any) => {
      this.trainers = res;
    });
  }
  getLocations() {
    this.locationService.getAllLocations().subscribe((res: any) => {
      this.locations = res;
    });
  }
  getStages() {
    this.stageService.getAllStages().subscribe((res: any) => {
      this.stages = res;
    });
  }
  getResults() {
    this.resultService.getAllResults().subscribe((res: any) => {
      this.results = res;
    });
  }
  getVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res: any) => {
      this.vehicles = res;
    });
  }
  getTitles() {
    this.titleService.getAllTitles().subscribe((res: any) => {
      this.titles = res;
    });
  }

  createForm(): void {
    this.assessmentForm = this.fb.group({
      categories: this.fb.array(
        this.categories.map((category: apiCategoryModel) =>
          this.fb.group({
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
    this.resetForm();
  }

  resetForm(): void {
    this.formDriver.reset();
    this.assessmentForm.reset(this.initialFormData); // Reset form to initial state
    this.assessmentForm.markAsPristine(); // Optional: mark form as pristine
  }
}
