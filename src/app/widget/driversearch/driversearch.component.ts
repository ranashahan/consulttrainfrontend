import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any; // Access Bootstrap's global object

@Component({
  selector: 'app-driversearch',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './driversearch.component.html',
  styleUrl: './driversearch.component.css',
})
export class DriversearchComponent {
  searchForm: FormGroup;
  drivers: any[] = [];
  @Output() driverSelected = new EventEmitter<number>(); // Event to emit driver ID

  constructor(private fb: FormBuilder, private driverService: DriverService) {
    this.searchForm = this.fb.group({
      nic: [''],
    });
  }

  // Search drivers
  searchDrivers() {
    const searchCriteria = this.searchForm.value.nic;
    this.driverService.searchDrivers(searchCriteria).subscribe((data) => {
      this.drivers = data;
    });
  }

  // Select driver and emit the ID
  selectDriver(driverId: number) {
    this.driverSelected.emit(driverId); // Emit the selected driver ID
  }

  openModal() {
    const modalElement = document.getElementById('driverSearchModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      console.error('Modal element not found');
    }
  }
}
