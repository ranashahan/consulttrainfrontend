import { Component, OnInit } from '@angular/core';
import { DltypeService } from '../../services/dltype.service';
import { UtilitiesService } from '../../services/utilities.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiGenericModel } from '../../model/Generic';

@Component({
  selector: 'app-dltype',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dltype.component.html',
  styleUrl: './dltype.component.css',
})
export class DltypeComponent implements OnInit {
  dltypes: apiGenericModel[] = [];
  formSaveDLType = new FormGroup({
    type: new FormControl(),
  });
  constructor(
    private dltypeService: DltypeService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Driver License Type');
    this.getAll();
  }

  getAll() {
    this.dltypeService.getAllDLTypes().subscribe((res: any) => {
      this.dltypes = res;
    });
  }

  updateDLType(id: number, dltype: string) {
    this.dltypeService.updateDLTypes(id, dltype).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  createDLType(dltype: string) {
    this.dltypeService.createDLTypes(dltype).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(dltype: any) {
    this.dltypes.forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    dltype.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('dltype-table', 'Consult-dltypes-export');
  }
  formRest() {
    this.formSaveDLType.reset();
  }
}
