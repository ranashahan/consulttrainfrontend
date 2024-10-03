import { Component, OnInit } from '@angular/core';
import { apiActivityModel } from '../../model/Activity';
import { ActivityService } from '../../services/activity.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent implements OnInit {
  selectedCategoryId: number = 0;
  activities: apiActivityModel[] = [];
  scondaryCategories: apiActivityModel[] = [];

  formActivity = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    initials: new FormControl(),
    slavecategoryid: new FormControl(),
  });
  constructor(
    private activityService: ActivityService,
    private Utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.activityService.selectedCategoryId$.subscribe((categoryId) => {
      this.selectedCategoryId = categoryId;
      this.getByScondaryID(categoryId);
    });

    this.getByScondaryID(5);
    this.getSlaveCategories();
  }

  getSlaveCategories() {
    this.activityService.getAllSlaveCategories().subscribe((res: any) => {
      this.scondaryCategories = res;
    });
  }

  getByScondaryID(id: number) {
    this.activityService.getActivityBySlaveID(id).subscribe((res: any) => {
      this.activities = res;
    });
  }

  getSlaveCategoryName(slavecategoryid: number): string {
    const foundCategory = this.scondaryCategories.find(
      (category) => category.id === slavecategoryid
    );
    return foundCategory ? foundCategory.name : '';
  }
  create(
    name: string,
    description: string,
    initials: string,
    slavecategoryid: number
  ) {
    this.activityService
      .createActivity(name, description, initials, slavecategoryid)
      .subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      });
  }
  update(
    id: number,
    name: string,
    description: string,
    initials: string,
    slavecategoryid: number
  ) {
    this.activityService
      .updateActivity(id, name, description, initials, slavecategoryid)
      .subscribe((res: any) => {
        alert('Activity Updated Successfully');
      });
  }

  onEdit(item: any) {
    this.activities.forEach((element: apiActivityModel) => {
      element.isEdit = false;
    });
    item.isEdit = true;
  }
  executeExport() {
    this.Utils.exportToExcel('activity-table', 'Consult-Activity-export');
  }
  formReset() {
    this.formActivity.reset();
  }
}
