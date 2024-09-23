import { Component, OnInit } from '@angular/core';
import { apiGenericModel } from '../../model/Generic';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StageService } from '../../services/stage.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.css',
})
export class StageComponent implements OnInit {
  stages: apiGenericModel[] = [];
  formSaveStage = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private stageService: StageService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Stages');
    this.getAll();
  }

  getAll() {
    this.stageService.getAllStages().subscribe((res: any) => {
      this.stages = res;
    });
  }

  update(id: number, name: string) {
    this.stageService.updateStage(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.stageService.createStage(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(stage: any) {
    this.stages.forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    stage.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('stage-table', 'Consult-stage-export');
  }
  formRest() {
    this.formSaveStage.reset();
  }
}
