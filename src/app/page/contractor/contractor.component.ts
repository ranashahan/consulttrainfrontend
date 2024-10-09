import { Component, Input, OnInit, signal } from '@angular/core';
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
})
export class ContractorComponent implements OnInit {
  @Input() contractor: any;
  contractors = signal<apiContractorModel[]>([]);
  clients = signal<apiClientModel[]>([]);
  paginatedContractors: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 0;
  pages: number[] = [];
  filteredContractors: any[] = [];
  searchTerm: string = '';

  selectedClientIds = new FormControl();
  isAlert: boolean = false;
  alertType = '';
  successMessage: string = '';

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

  constructor(
    private utils: UtilitiesService,
    private contractorService: ContractorService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Contractor');
    this.getAll();
    this.getClients();
    //this.selectedClientIds.setValue([1, 4]);
  }

  Selected(clientId: string[]) {
    this.selectedClientIds.setValue(clientId);
  }

  getAll() {
    this.contractorService.getAllContractors().subscribe((res: any) => {
      this.contractors.set(res);
      this.filterContractors();
    });
  }

  getClients() {
    this.clientService.getAll().subscribe((res: any) => {
      this.clients.set(res);
    });
  }
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
        });
    }
  }

  /**
   * this method for only create contractor
   * @param {object} object of formContractor
   */
  createContractor(obj: any) {
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
    });
  }

  onEdit(contractor: any) {
    this.Selected(contractor.clientids.split(',').map(Number));
    this.contractors().forEach((element: apiContractorModel) => {
      element.isEdit = false;
    });
    contractor.isEdit = true;
  }

  executeExport() {
    this.utils.exportToExcel('contractor-table', 'Consult-contractor-export');
  }

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

  updatePaginatedContractors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedContractors = this.filteredContractors.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedContractors();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedContractors();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedContractors();
  }

  formRest() {
    this.formSaveContractor.reset();
  }

  // getClientIds(id: string) {
  //   this.selectedClientIds = id;
  // }
}
