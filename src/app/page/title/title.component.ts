import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiGenericModel } from '../../model/Generic';
import { TitleService } from '../../services/title.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent implements OnInit {
  titles = signal<apiGenericModel[]>([]);
  formSaveTitle = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    private titleService: TitleService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Titles');
    this.getAll();
  }

  getAll() {
    this.titleService.getAllTitles().subscribe((res: any) => {
      this.titles.set(res);
    });
  }

  update(id: number, name: string) {
    this.titleService.updateTitle(id, name).subscribe((res: any) => {
      alert('saved successfully.');
    });
  }

  create(name: string) {
    this.titleService.createTitle(name).subscribe((res: any) => {
      onmessage = res.message;
      alert(onmessage);
    });
  }

  onEdit(title: any) {
    this.titles().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    title.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('title-table', 'Consult-title-export');
  }
  formRest() {
    this.formSaveTitle.reset();
  }
}
