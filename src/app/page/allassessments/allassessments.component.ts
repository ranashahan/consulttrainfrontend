import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { AssessmentService } from '../../services/assessment.service';
import { apiSessionModel } from '../../model/Assessment';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { apiContractorModel } from '../../model/Contractor';
import { apiGenericModel } from '../../model/Generic';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContractorService } from '../../services/contractor.service';
import { LocationService } from '../../services/location.service';
import { StageService } from '../../services/stage.service';
import { ResultService } from '../../services/result.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-allassessments',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './allassessments.component.html',
  styleUrl: './allassessments.component.css',
})
export class AllassessmentsComponent implements OnInit, OnDestroy {
  sessions = signal<apiSessionModel[]>([]);
  subscriptionList: Subscription[] = [];
  initialValues: apiSessionModel[] = [];
  contractors = signal<apiContractorModel[]>([]);
  locations = signal<apiGenericModel[]>([]);
  results = signal<apiGenericModel[]>([]);
  stages = signal<apiGenericModel[]>([]);

  paginatedSessions = signal<apiSessionModel[]>([]);
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 0;
  pages: number[] = [];
  filteredSessions: any[] = [];
  searchTerm: string = '';

  today = new Date();
  oneMonthAgo = new Date(
    this.today.getFullYear(),
    this.today.getMonth() - 1,
    this.today.getDate()
  );
  oneMonthAhead = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() + 1
  );

  formSession: FormGroup;

  constructor(
    private utils: UtilitiesService,
    private assessmentService: AssessmentService,
    private fb: FormBuilder,
    private cService: ContractorService,
    private lService: LocationService,
    private sService: StageService,
    private rService: ResultService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.utils.setTitle('All Assessments');

    this.formSession = this.fb.group({
      name: [''],
      sessiondate: [null],
      locationid: [null],
      contractorid: [null],
      drivername: [''],
      nic: [''],
      resultid: [null],
      stageid: [null],
      startDate: [this.oneMonthAgo.toISOString().substring(0, 10)],
      endDate: [this.oneMonthAhead.toISOString().substring(0, 10)],
    });
  }

  ngOnInit(): void {
    this.getAllSessionsByDate();
    this.getContractors();
    this.getLocations();
    this.getResults();
    this.getStages();
  }

  getAllSessionsByDate() {
    this.subscriptionList.push(
      this.assessmentService
        .getSessionbydate(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          this.formSession.value.startDate,
          this.formSession.value.endDate
        )
        .subscribe((res: any) => {
          this.sessions.set(res);
          this.initialValues = res;
          this.filterSessions();
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
  getLocations() {
    this.subscriptionList.push(
      this.lService.getAllLocations().subscribe((res: any) => {
        this.locations.set(res);
      })
    );
  }
  getStages() {
    this.subscriptionList.push(
      this.sService.getAllStages().subscribe((res: any) => {
        this.stages.set(res);
      })
    );
  }
  getResults() {
    this.subscriptionList.push(
      this.rService.getAllResults().subscribe((res: any) => {
        this.results.set(res);
      })
    );
  }

  viewAssessmentDetails(id: number): void {
    // Navigate to the driver detail page
    this.router.navigate([`/allassessments/${id}`], { relativeTo: this.route });
  }

  deleteAssessment(id: number): void {
    if (confirm('Are you really want to delete assessment?'))
      this.subscriptionList
        .push
        //   this.driverService.deleteDriverByID(id).subscribe((res: any) => {
        //     alert('Driver deleted successfully');
        //     this.getAll();
        //   })
        ();
  }

  getStageName(itemId: number): string {
    return this.utils.getGenericName(this.stages(), itemId);
  }
  getResultName(itemId: number): string {
    return this.utils.getGenericName(this.results(), itemId);
  }
  getLocationName(itemId: number): string {
    return this.utils.getGenericName(this.locations(), itemId);
  }
  getContractorName(itemId: number): string {
    return this.utils.getGenericName(this.contractors(), itemId);
  }

  getFillterredData() {
    this.subscriptionList.push(
      this.assessmentService
        .getSessionbydate(
          this.formSession.value.nic,
          this.formSession.value.name,
          this.formSession.value.sessiondate,
          this.formSession.value.contractorid,
          this.formSession.value.resultid,
          this.formSession.value.stageid,
          this.formSession.value.locationid,
          this.formSession.value.startDate,
          this.formSession.value.endDate
        )
        .subscribe((res: any) => {
          this.sessions.set(res);
          this.filterSessions();
        })
    );
  }
  filterSessions(): void {
    if (this.sessions() && this.sessions().length > 0) {
      if (this.searchTerm) {
        this.filteredSessions = this.sessions().filter((session) =>
          session.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredSessions = this.sessions();
      }

      this.currentPage = 1; // Reset to the first page
      this.totalPages = Math.ceil(
        this.filteredSessions.length / this.itemsPerPage
      );
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedSessions();
    } else {
      // Handle case where drivers are null or empty
      this.filteredSessions = [];
      this.totalPages = 0;
      this.pages = [];
      this.updatePaginatedSessions();
    }
  }

  updatePaginatedSessions(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedSessions.set(
      this.filteredSessions.slice(startIndex, startIndex + this.itemsPerPage)
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSessions();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSessions();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedSessions();
  }

  executeExport() {
    this.utils.exportToExcel(
      'allassessment-table',
      'Consult-assessment-export'
    );
  }

  formRest() {
    this.formSession.reset({
      name: '',
      sessiondate: null,
      locationid: null,
      contractorid: null,
      nic: '',
      resultid: null,
      stageid: null,
      startDate: this.oneMonthAgo.toISOString().substring(0, 10),
      endDate: this.oneMonthAhead.toISOString().substring(0, 10),
    });
    this.sessions.set(this.initialValues);
    this.filterSessions();
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
