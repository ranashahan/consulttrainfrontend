import { Component, OnInit, signal } from '@angular/core';
import { apiGenericModel } from '../../model/Generic';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent implements OnInit {
  locations = signal<apiGenericModel[]>([]);
  formSaveLocation = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private locationService: LocationService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Locations');
    this.getAll();
  }

  getAll() {
    this.locationService.getAllLocations().subscribe((res: any) => {
      this.locations.set(res);
    });
  }

  updateLocation(id: number, name: string) {
    this.locationService.updateLocation(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  createLocation(name: string) {
    this.locationService.createLocation(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(location: any) {
    this.locations().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    location.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('location-table', 'Consult-location-export');
  }
  formRest() {
    this.formSaveLocation.reset();
  }
}
