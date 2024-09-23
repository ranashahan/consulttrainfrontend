import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BloodgroupService } from '../../services/bloodgroup.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { apiGenericModel } from '../../model/Generic';

@Component({
  selector: 'app-blood-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blood-group.component.html',
  styleUrl: './blood-group.component.css',
})
export class BloodGroupComponent implements OnInit {
  formSaveBg = new FormGroup({
    name: new FormControl(),
  });

  bloodgroups: apiGenericModel[] = [];
  constructor(
    private bgService: BloodgroupService,
    private utils: UtilitiesService
  ) {}
  ngOnInit(): void {
    this.utils.setTitle('Blood Groups');

    this.getAll();
  }

  getAll() {
    this.bgService.getAllBloodgroups().subscribe((res: any) => {
      this.bloodgroups = res;
    });
  }

  update(id: number, name: string) {
    this.bgService.updateBloodGroup(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.bgService.createBloodGroup(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(blood: any) {
    this.bloodgroups.forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    blood.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('blood-table', 'Consult-bloodGroups-export');
  }
  formRest() {
    this.formSaveBg.reset();
  }
}
