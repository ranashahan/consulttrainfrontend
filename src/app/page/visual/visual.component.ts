import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiGenericModel } from '../../model/Generic';
import { VisualService } from '../../services/visual.service';
import { UtilitiesService } from '../../services/utilities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visual',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './visual.component.html',
  styleUrl: './visual.component.css',
})
export class VisualComponent implements OnInit {
  visuals: apiGenericModel[] = [];
  formSaveVisual = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private visualService: VisualService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Visuals');
    this.getAll();
  }

  getAll() {
    this.visualService.getAllVisuals().subscribe((res: any) => {
      this.visuals = res;
    });
  }

  update(id: number, name: string) {
    this.visualService.updateVisual(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.visualService.createVisual(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(visual: any) {
    this.visuals.forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    visual.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('visual-table', 'Consult-visual-export');
  }
  formRest() {
    this.formSaveVisual.reset();
  }
}
