import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  apiMasterCategoryModel,
  apiSlaveCategoryModel,
} from '../../model/Category';
import { ActivityService } from '../../services/activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slavecategory',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './slavecategory.component.html',
  styleUrl: './slavecategory.component.css',
})
export class SlavecategoryComponent implements OnInit, OnDestroy {
  primaryCategories = signal<apiMasterCategoryModel[]>([]);
  secondaryCategories = signal<apiSlaveCategoryModel[]>([]);

  subscriptionList: Subscription[] = [];

  formSecondaryCategory = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    initials: new FormControl(),
    mastercategoryid: new FormControl(),
  });
  constructor(
    private activityService: ActivityService,
    private Utils: UtilitiesService
  ) {}
  ngOnInit(): void {
    this.getAll();
    this.getAllPrimary();
  }

  getAllPrimary(): void {
    this.subscriptionList.push(
      this.activityService.getMasterCategoriesAll().subscribe((res: any) => {
        this.primaryCategories.set(res);
      })
    );
  }

  getMasterCategoryName(mastercategoryid: number): string {
    const foundCategory = this.primaryCategories().find(
      (category) => category.id === mastercategoryid
    );
    return foundCategory ? foundCategory.name : '';
  }

  getAll(): void {
    this.subscriptionList.push(
      this.activityService.getSlaveCategoriesAll().subscribe((res: any) => {
        this.secondaryCategories.set(res);
      })
    );
  }
  update(
    id: number,
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ) {
    this.subscriptionList.push(
      this.activityService
        .updateSlaveCategory(id, name, description, initials, mastercategoryid)
        .subscribe((res: any) => {
          alert('Secondary Category Updated Successfully');
          this.getAll();
        })
    );
  }

  create(
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ) {
    this.subscriptionList.push(
      this.activityService
        .createSlaveCategory(name, description, initials, mastercategoryid)
        .subscribe((res: any) => {
          onmessage = res.message;
          alert(onmessage);
          this.getAll();
        })
    );
  }

  onEdit(item: any) {
    this.secondaryCategories().forEach((element: apiSlaveCategoryModel) => {
      element.isEdit = false;
    });
    item.isEdit = true;
  }
  executeExport() {
    this.Utils.exportToExcel(
      'secondarycategory-table',
      'Consult-SecondaryCategory-export'
    );
  }
  formReset() {
    this.formSecondaryCategory.reset();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
