import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { ContractorService } from '../../services/contractor.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiContractorModel } from '../../model/Contractor';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { apiClientModel } from '../../model/Client';
import { AlertComponent } from '../../widget/alert/alert.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contractor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractorComponent implements OnInit, OnDestroy {
  /**
   * contractor signal
   */
  contractors = signal<apiContractorModel[]>([]);
  /**
   * client signal
   */
  clients = signal<apiClientModel[]>([]);
  /**
   * paginated contractors
   */
  paginatedContractors: any[] = [];
  /**
   * current page
   */
  currentPage: number = 1;
  /**
   * itemPerPage
   */
  itemsPerPage: number = 25;
  /**
   * total pages
   */
  totalPages: number = 0;
  /**
   * Pages
   */
  pages: number[] = [];
  /**
   * filtered Contractors
   */
  filteredContractors: any[] = [];
  /**
   * Search query
   */
  searchTerm: string = '';

  /**
   * Form client selected
   */
  selectedClientIds = new FormControl();
  /**
   * IsAlert boolean
   */
  isAlert: boolean = false;
  /**
   * alert type
   */
  alertType = '';
  /**
   * success message
   */
  successMessage: string = '';
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];
  /**
   * Form for creating new contractor
   */
  formSaveContractor = new FormGroup({
    name: new FormControl(),
    ntnnumber: new FormControl(),
    contactname: new FormControl(),
    contactnumber: new FormControl(),
    contactdesignation: new FormControl(),
    contactdepartment: new FormControl(),
    address: new FormControl(),
    initials: new FormControl(),
    clientids: new FormControl(),
    clientnames: new FormControl(),
  });

  /**
   * Constructor
   * @param utils utilities service for set page title
   * @param contractorService contractor service for api calls
   * @param clientService client service for api calls
   */
  constructor(
    private utils: UtilitiesService,
    private contractorService: ContractorService,
    private clientService: ClientService
  ) {}
  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Contractor');
    this.getAll();
    this.getClients();
  }

  /**
   * Thid method will show how many clients already have associated with contractor
   * @param clientId {array of string} contractor clients ids
   */
  Selected(clientId: string[]) {
    this.selectedClientIds.setValue(clientId);
  }
  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.contractorService.getAllContractors().subscribe((res: any) => {
        this.contractors.set(res);
        this.filterContractors();
      })
    );
  }
  /**
   * This method will fetch all the records from database.
   */
  getClients() {
    this.subscriptionList.push(
      this.clientService.getAll().subscribe((res: any) => {
        this.clients.set(res);
      })
    );
  }

  /**
   * This method will update visual against id
   * @param id {number} contractor id
   * @param name {string} contractor name
   * @param ntnnumber {string} contractor ntn number
   * @param contactname {string} contractor contact name
   * @param contactnumber {string} contractor contact number
   * @param contactdesignation {string} contractor contact designation
   * @param contactdepartment {string} contractor contact department
   * @param address {string} contractor address
   * @param initials {string} contractor initials
   * @param clientids {array of strings} contractor client IDs
   */
  updateContractor(
    id: number,
    name: string,
    ntnnumber: string,
    contactname: string,
    contactnumber: string,
    contactdesignation: string,
    contactdepartment: string,
    address: string,
    initials: string,
    clientids: string[]
  ) {
    if (clientids.length < 1) {
      if (this.isAlert) {
        this.isAlert = false;
      }
      this.successMessage =
        'Client Ids are mandatory, please associate some clients with contractor';
      this.alertType = 'danger';
      this.isAlert = true;
    } else {
      this.subscriptionList.push(
        this.contractorService
          .updateContractor(
            id,
            name,
            ntnnumber,
            contactname,
            contactnumber,
            contactdesignation,
            contactdepartment,
            address,
            initials,
            clientids
          )
          .subscribe((res: any) => {
            if (this.isAlert) {
              this.isAlert = false;
            }
            this.successMessage = ' Contractor Saved Successfully';
            this.alertType = 'success';
            this.isAlert = true;
            this.formRest();
            this.getAll();
          })
      );
    }
  }

  /**
   * this method for only create contractor
   * @param object of formContractor
   */
  createContractor(obj: any) {
    this.subscriptionList.push(
      this.contractorService.createContractor(obj).subscribe({
        next: (result) => {
          if (this.isAlert) {
            this.isAlert = false;
          }
          this.successMessage = result.message;
          this.alertType = 'success';
          this.isAlert = true;
          this.formRest();
          this.getAll();
        },
        error: (err) => {
          console.error('Error creating contractor:', err.message);
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
  /**
   * This method will enable editalble fields.
   * @param contractor contractor
   */
  onEdit(contractor: any) {
    this.Selected(contractor.clientids.split(',').map(Number));
    this.contractors().forEach((element: apiContractorModel) => {
      element.isEdit = false;
    });
    contractor.isEdit = true;
  }
  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('contractor-table', 'Consult-contractor-export');
  }

  /**
   * This method will filter the contractors by name
   */

  filterContractors(): void {
    if (this.searchTerm) {
      this.filteredContractors = this.contractors().filter((contractor) =>
        contractor.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredContractors = this.contractors();
    }
    this.currentPage = 1; // Reset to the first page
    this.totalPages = Math.ceil(
      this.filteredContractors.length / this.itemsPerPage
    );
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedContractors();
  }

  /**
   * This method will update the paginated contractors
   */

  updatePaginatedContractors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedContractors = this.filteredContractors.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
  /**
   * This method will work with pagination previous button
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedContractors();
    }
  }

  /**
   * This methid will work with pagination next button
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedContractors();
    }
  }
  /**
   * This method will navigate to page number
   * @param page number page
   */
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedContractors();
  }
  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveContractor.reset();
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
