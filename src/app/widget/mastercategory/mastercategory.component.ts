import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilitiesService } from '../../services/utilities.service';
import { apiMasterCategoryModel } from '../../model/Category';
import { ActivityService } from '../../services/activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mastercategory',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mastercategory.component.html',
  styleUrl: './mastercategory.component.css',
})
export class MastercategoryComponent implements OnInit, OnDestroy {
  primaryCategories = signal<apiMasterCategoryModel[]>([]);
  formPrimaryCategory = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  subscriptionList: Subscription[] = [];

  constructor(
    private utils: UtilitiesService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.subscriptionList.push(
      this.activityService.getMasterCategoriesAll().subscribe((res: any) => {
        this.primaryCategories.set(res);
      })
    );
  }
  update(id: number, name: string, description: string) {
    this.subscriptionList.push(
      this.activityService
        .updateMasterCategory(id, name, description)
        .subscribe((res: any) => {
          alert('Primary Category Updated Successfully');
          this.getAll();
        })
    );
  }

  create(name: string, description: string) {
    this.subscriptionList.push(
      this.activityService
        .createMasterCategory(name, description)
        .subscribe((res: any) => {
          onmessage = res.message;
          alert(onmessage);
          this.getAll();
        })
    );
  }

  onEdit(item: any) {
    this.primaryCategories().forEach((element: apiMasterCategoryModel) => {
      element.isEdit = false;
    });
    item.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel(
      'primarycategory-table',
      'Consult-PrimaryCategory-export'
    );
  }
  formReset() {
    this.formPrimaryCategory.reset();
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
