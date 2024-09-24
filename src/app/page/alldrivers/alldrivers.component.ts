import { Component, OnInit, ViewChild } from '@angular/core';
import { apiDriverModel } from '../../model/Driver';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { apiContractorModel } from '../../model/Contractor';
import { ContractorService } from '../../services/contractor.service';
import { apiGenericModel } from '../../model/Generic';
import { DltypeService } from '../../services/dltype.service';

@Component({
  selector: 'app-alldrivers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './alldrivers.component.html',
  styleUrl: './alldrivers.component.css',
})
export class AlldriversComponent implements OnInit {
  drivers: apiDriverModel[] = [];
  contractors: apiContractorModel[] = [];
  dltypes: apiGenericModel[] = [];

  sortKey: string = 'id'; // Default sorting column
  sortDirection: string = 'asc';

  paginatedDrivers: apiDriverModel[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  filteredDrivers: any[] = [];
  searchTerm: string = '';

  formSaveDrivers = new FormGroup({
    name: new FormControl(),
    nic: new FormControl(),
    licensenumber: new FormControl(),
    permitnumber: new FormControl(),
    permitexpiry: new FormControl(),
    contractorid: new FormControl(),
  });
  constructor(
    private router: Router,
    private driverService: DriverService,
    private utils: UtilitiesService,
    private cService: ContractorService,
    private dltypeService: DltypeService
  ) {}
  ngOnInit(): void {
    this.utils.setTitle('All Drivers');
    this.getAll();
    this.getContractors();
    this.getDLTypes();
  }
  getFillterredData() {
    this.driverService
      .searchDrivers(
        this.formSaveDrivers.value.nic,
        this.formSaveDrivers.value.licensenumber,
        this.formSaveDrivers.value.name,
        this.formSaveDrivers.value.contractorid,
        this.formSaveDrivers.value.permitexpiry,
        this.formSaveDrivers.value.permitnumber
      )
      .subscribe((res) => {
        this.drivers = [];
        this.drivers = res;
        this.filterDrivers();
      });
    console.log(this.formSaveDrivers.value);
  }

  getAll() {
    this.driverService.getAllDrivers().subscribe((res: any) => {
      this.drivers = res;
      this.filterDrivers();
    });
  }

  deleteDriver(id: number) {
    if (confirm('Are you really want to delete driver'))
      this.driverService.deleteDriverByID(id).subscribe((res: any) => {
        alert('Driver deleted successfully');
        this.getAll();
      });
  }

  executeExport() {
    this.utils.exportToExcel('alldrivers-table', 'Consult-driver-export');
  }
  formRest() {
    this.formSaveDrivers.reset();
    this.getAll();
  }

  viewDriverDetails(id: number): void {
    // Navigate to the driver detail page
    this.router.navigate([`/alldrivers/${id}`]);
  }

  getContractors() {
    this.cService.getAllContractors().subscribe((res: any) => {
      this.contractors = res;
    });
  }

  getContractosName(contractorId: number): string {
    return this.utils.getGenericName(this.contractors, contractorId);
  }

  getDLTypes() {
    this.dltypeService.getAllDLTypes().subscribe((res: any) => {
      this.dltypes = res;
    });
  }

  getDLTypesName(dlTypeId: number): string {
    return this.utils.getGenericName(this.dltypes, dlTypeId);
  }

  // Sorting function
  sortData(column: string) {
    this.sortKey = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.drivers.sort((a, b) => {
      const valueA = a[column as keyof apiDriverModel];
      const valueB = b[column as keyof apiDriverModel];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }

  filterDrivers(): void {
    if (this.searchTerm) {
      this.filteredDrivers = this.drivers.filter((driver) =>
        driver.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDrivers = this.drivers;
    }
    this.currentPage = 1; // Reset to the first page
    this.totalPages = Math.ceil(
      this.filteredDrivers.length / this.itemsPerPage
    );
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedDrivers();
  }

  updatePaginatedDrivers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDrivers = this.filteredDrivers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDrivers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDrivers();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedDrivers();
  }
}
