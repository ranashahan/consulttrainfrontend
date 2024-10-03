import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-slavecategory',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './slavecategory.component.html',
  styleUrl: './slavecategory.component.css',
})
export class SlavecategoryComponent implements OnInit {
  private readonly apiURL = `${environment.apiUrl}activity/slave/`;
  primaryCategories: any[] = [];
  secondaryCategories: apiSecondaryModel[] = [];

  formSecondaryCategory = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    initials: new FormControl(),
    mastercategoryid: new FormControl(),
  });
  constructor(
    private http: HttpClient,
    private Utils: UtilitiesService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getAll();
    this.getAllPrimary();
  }

  getAllPrimary(): void {
    this.http
      .get(`${environment.apiUrl}activity/master/getAll`)
      .subscribe((res: any) => {
        this.primaryCategories = res;
      });
  }

  getMasterCategoryName(mastercategoryid: number): string {
    const foundCategory = this.primaryCategories.find(
      (category) => category.id === mastercategoryid
    );
    return foundCategory ? foundCategory.name : '';
  }

  getAll(): void {
    this.http
      .get<apiSecondaryModel>(this.apiURL + 'getAll')
      .subscribe((res: any) => {
        this.secondaryCategories = res;
      });
  }
  update(
    id: number,
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ) {
    this.http
      .put<apiSecondaryModel>(this.apiURL + id, {
        name,
        description,
        initials,
        mastercategoryid,
        userid: this.authService.getUserID(),
      })
      .subscribe((res: any) => {
        alert('Secondary Category Updated Successfully');
        this.getAll();
      });
  }

  create(
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ) {
    console.log(name + description + initials + mastercategoryid);
    this.http
      .post<apiSecondaryModel>(this.apiURL + 'create', {
        name,
        description,
        initials,
        mastercategoryid,
        userid: this.authService.getUserID(),
      })
      .subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
        this.getAll();
      });
  }

  onEdit(item: any) {
    this.secondaryCategories.forEach((element: apiSecondaryModel) => {
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
}
interface apiSecondaryModel {
  id: number;
  name: string;
  description: string;
  initials: string;
  mastercategoryid: number;
  active: number;
  createdby: number;
  modifiedby: number;
  created_at: string;
  modified_at: string;
  isEdit: boolean;
}
