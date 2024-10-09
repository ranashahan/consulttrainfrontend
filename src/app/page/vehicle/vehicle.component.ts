import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiGenericModel } from '../../model/Generic';
import { VehicleService } from '../../services/vehicle.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css',
})
export class VehicleComponent implements OnInit {
  vehicles = signal<apiGenericModel[]>([]);
  formSaveVehicle = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private vehicleService: VehicleService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Vehicles');
    this.getAll();
  }

  getAll() {
    this.vehicleService.getAllVehicles().subscribe((res: any) => {
      this.vehicles.set(res);
    });
  }

  update(id: number, name: string) {
    this.vehicleService.updateVehicle(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.vehicleService.createVehicle(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(vehicle: any) {
    this.vehicles().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    vehicle.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('vehicle-table', 'Consult-vehicle-export');
  }
  formRest() {
    this.formSaveVehicle.reset();
  }
}
