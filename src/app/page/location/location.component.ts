import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent implements OnInit, OnDestroy {
  /**
   * location signal
   */
  locations = signal<apiGenericModel[]>([]);

  /**
   * Form for creating new vehicle
   */
  formSaveLocation = new FormGroup({
    name: new FormControl(),
  });

  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param locationService location service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private locationService: LocationService,
    private utils: UtilitiesService
  ) {}

  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Locations');
    this.getAll();
  }

  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.locationService.getAllLocations().subscribe((res: any) => {
        this.locations.set(res);
      })
    );
  }

  /**
   * This method will update location against id
   * @param id {number} location id
   * @param name {string} location name
   */
  updateLocation(id: number, name: string) {
    this.subscriptionList.push(
      this.locationService.updateLocation(id, name).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }

  /**
   * This method will create new location
   * @param name {string} location name
   */
  createLocation(name: string) {
    this.subscriptionList.push(
      this.locationService.createLocation(name).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }

  /**
   * This method will enable editalble fields.
   * @param location location
   */
  onEdit(location: any) {
    this.locations().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    location.isEdit = true;
  }

  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('location-table', 'Consult-location-export');
  }

  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveLocation.reset();
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
