import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { apiContractorModel } from '../../model/Contractor';
import { ContractorService } from '../../services/contractor.service';
import { apiGenericModel } from '../../model/Generic';
import { DltypeService } from '../../services/dltype.service';
import { Subscription } from 'rxjs';

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
export class AlldriversComponent implements OnInit, OnDestroy {
  drivers = signal<apiDriverModel[]>([]);
  initialValues: apiDriverModel[] = [];
  contractors = signal<apiContractorModel[]>([]);
  dltypes = signal<apiGenericModel[]>([]);

  paginatedDrivers = signal<apiDriverModel[]>([]);
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  filteredDrivers: any[] = [];
  searchTerm: string = '';

  subscriptionList: Subscription[] = [];

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
    private route: ActivatedRoute,
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
    this.subscriptionList.push(
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
          this.drivers.set(res);
          this.filterDrivers();
        })
    );
  }

  getAll() {
    this.subscriptionList.push(
      this.driverService.getAllDrivers().subscribe((res: any) => {
        this.drivers.set(res);
        this.initialValues = res;
        this.filterDrivers();
      })
    );
  }

  deleteDriver(id: number) {
    if (confirm('Are you really want to delete driver?'))
      this.subscriptionList.push(
        this.driverService.deleteDriverByID(id).subscribe((res: any) => {
          alert('Driver deleted successfully');
          this.getAll();
        })
      );
  }

  executeExport() {
    this.utils.exportToExcel('alldrivers-table', 'Consult-driver-export');
  }
  formRest() {
    this.formSaveDrivers.reset();
    this.drivers.set(this.initialValues);
    this.filterDrivers();
  }

  viewDriverDetails(id: number): void {
    // Navigate to the driver detail page
    this.router.navigate([`/alldrivers/${id}`], { relativeTo: this.route });
  }

  getContractors() {
    this.subscriptionList.push(
      this.cService.getAllContractors().subscribe((res: any) => {
        this.contractors.set(res);
      })
    );
  }

  getContractorName(contractorId: number): string {
    return this.utils.getGenericName(this.contractors(), contractorId);
  }

  getDLTypes() {
    this.subscriptionList.push(
      this.dltypeService.getAllDLTypes().subscribe((res: any) => {
        this.dltypes.set(res);
      })
    );
  }

  getDLTypesName(dlTypeId: number): string {
    return this.utils.getGenericName(this.dltypes(), dlTypeId);
  }

  filterDrivers(): void {
    if (this.drivers() && this.drivers().length > 0) {
      if (this.searchTerm) {
        this.filteredDrivers = this.drivers().filter((driver) =>
          driver.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredDrivers = this.drivers();
      }

      this.currentPage = 1; // Reset to the first page
      this.totalPages = Math.ceil(
        this.filteredDrivers.length / this.itemsPerPage
      );
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedDrivers();
    } else {
      // Handle case where drivers are null or empty
      this.filteredDrivers = [];
      this.totalPages = 0;
      this.pages = [];
      this.updatePaginatedDrivers();
    }
  }

  updatePaginatedDrivers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDrivers.set(
      this.filteredDrivers.slice(startIndex, startIndex + this.itemsPerPage)
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

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
