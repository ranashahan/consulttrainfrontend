import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-contractor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.css',
})
export class ContractorComponent implements OnInit {
  @Input() contractor: any;
  contractors: apiContractorModel[] = [];
  clients: apiClientModel[] = [];
  paginatedContractors: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  filteredContractors: any[] = [];
  searchTerm: string = '';
  selectedClientIds: number[] = [];

  formSaveContractor = new FormGroup({
    name: new FormControl(),
    contact: new FormControl(),
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
  }

  getAll() {
    this.contractorService.getAllContractors().subscribe((res: any) => {
      this.contractors = res;
      this.filterContractors();
    });
  }

  getClients() {
    this.clientService.getAll().subscribe((res: any) => {
      console.log(res);
      this.clients = res;
    });
  }
  updateContractor(
    id: number,
    name: string,
    contact: string,
    address: string,
    initials: string
  ) {
    // console.log('this is my id' + id, 'this is my assessor' + name);
    this.contractorService
      .updateContractor(id, name, contact, address, initials)
      .subscribe((res: any) => {
        alert('saved successfully.');
      });
  }

  createContractor(
    name: string,
    contact: string,
    address: string,
    initials: string
  ) {
    this.contractorService
      .createContractor(name, contact, address, initials)
      .subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      });
  }

  onEdit(contractor: any) {
    this.contractors.forEach((element: apiContractorModel) => {
      element.isEdit = false;
    });
    contractor.isEdit = true;
  }

  executeExport() {
    this.utils.exportToExcel('contractor-table', 'Consult-contractor-export');
  }

  filterContractors(): void {
    if (this.searchTerm) {
      this.filteredContractors = this.contractors.filter((contractor) =>
        contractor.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredContractors = this.contractors;
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
