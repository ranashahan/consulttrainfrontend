import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mastercategory',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mastercategory.component.html',
  styleUrl: './mastercategory.component.css',
})
export class MastercategoryComponent implements OnInit {
  private readonly apiURL = `${environment.apiUrl}activity/master/`;

  primaryCategories: apiPrimaryModel[] = [];
  formPrimaryCategory = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  constructor(
    private http: HttpClient,
    private utils: UtilitiesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.http
      .get<apiPrimaryModel>(this.apiURL + 'getAll')
      .subscribe((res: any) => {
        this.primaryCategories = res;
      });
  }
  update(id: number, name: string, description: string) {
    this.http
      .put<apiPrimaryModel>(this.apiURL + id, {
        name,
        description,
        userid: this.authService.getUserID(),
      })
      .subscribe((res: any) => {
        alert('Primary Category Updated Successfully');
        this.getAll();
      });
  }

  create(name: string, description: string) {
    this.http
      .post<apiPrimaryModel>(this.apiURL + 'create', {
        name,
        description,
        userid: this.authService.getUserID(),
      })
      .subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
        this.getAll();
      });
  }

  onEdit(item: any) {
    this.primaryCategories.forEach((element: apiPrimaryModel) => {
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
}
interface apiPrimaryModel {
  id: number;
  name: string;
  description: string;
  createdby: number;
  modifiedby: number;
  created_at: string;
  modified_at: string;
  isEdit: boolean;
}
