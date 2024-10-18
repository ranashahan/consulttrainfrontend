import { Component, Output, EventEmitter, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
import { apiDriverModel } from '../../model/Driver';
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
  drivers = signal<apiDriverModel[]>([]);
  @Output() driverSelected = new EventEmitter<object>(); // Event to emit driver ID

  constructor(private fb: FormBuilder, private driverService: DriverService) {
    this.searchForm = this.fb.group({
      nic: ['', Validators.required],
    });
  }

  // Search drivers
  searchDrivers() {
    const searchCriteria = this.searchForm.value.nic;
    this.driverService.getDriverByNIC(searchCriteria).subscribe((data: any) => {
      // console.log(data);
      this.drivers.set(data);
    });
  }

  // Select driver and emit the ID
  selectDriver(driver: object) {
    this.driverSelected.emit(driver); // Emit the selected driver ID
  }

  openModal() {
    const modalElement = document.getElementById('driverSearchModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      this.searchForm.reset();
      modalInstance.show();
    } else {
      console.error('Modal element not found');
    }
  }
}
