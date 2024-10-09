import { Component, OnInit, signal } from '@angular/core';
import { apiGenericModel } from '../../model/Generic';
import { ResultService } from '../../services/result.service';
import { UtilitiesService } from '../../services/utilities.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  results = signal<apiGenericModel[]>([]);
  formSaveResult = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private resultService: ResultService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Results');
    this.getAll();
  }

  getAll() {
    this.resultService.getAllResults().subscribe((res: any) => {
      this.results.set(res);
    });
  }

  update(id: number, name: string) {
    this.resultService.updateResult(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.resultService.createResult(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(result: any) {
    this.results().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    result.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('result-table', 'Consult-result-export');
  }
  formRest() {
    this.formSaveResult.reset();
  }
}
