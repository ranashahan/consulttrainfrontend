import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { BloodgroupService } from '../../services/bloodgroup.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { apiGenericModel } from '../../model/Generic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blood-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blood-group.component.html',
  styleUrl: './blood-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BloodGroupComponent implements OnInit, OnDestroy {
  /**
   * blood group signal
   */
  bloodgroups = signal<apiGenericModel[]>([]);
  /**
   * Form for creating new blood group
   */
  formSaveBg = new FormGroup({
    name: new FormControl(),
  });
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param bgService blood group service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private bgService: BloodgroupService,
    private utils: UtilitiesService
  ) {}

  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Blood Groups');

    this.getAll();
  }
  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.bgService.getAllBloodgroups().subscribe((res: any) => {
        this.bloodgroups.set(res);
      })
    );
  }
  /**
   * This method will update blood group against id
   * @param id {number} blood group id
   * @param name {string} blood group name
   */
  update(id: number, name: string) {
    this.subscriptionList.push(
      this.bgService.updateBloodGroup(id, name).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }
  /**
   * This method will create new blood group
   * @param name {string} blood group name
   */
  create(name: string) {
    this.subscriptionList.push(
      this.bgService.createBloodGroup(name).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }
  /**
   * This method will enable editalble fields.
   * @param blood blood group
   */
  onEdit(blood: any) {
    this.bloodgroups().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    blood.isEdit = true;
  }
  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('blood-table', 'Consult-bloodGroups-export');
  }
  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveBg.reset();
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
