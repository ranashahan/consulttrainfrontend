import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiTrainerModel } from '../../model/Trainer';
import { UtilitiesService } from '../../services/utilities.service';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css',
})
export class TrainersComponent implements OnInit {
  formSaveTrainer = new FormGroup({
    name: new FormControl(),
    initials: new FormControl(),
    mobile: new FormControl(),
    address: new FormControl(),
  });

  trainers = signal<apiTrainerModel[]>([]);

  constructor(
    private utils: UtilitiesService,
    private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Trainers');
    this.getAll();
  }

  getAll() {
    this.trainerService.getAllTrainers().subscribe((res: any) => {
      this.trainers.set(res);
    });
  }

  updateTrainer(
    id: number,
    name: string,
    initials: string,
    mobile: string,
    address: string
  ) {
    this.trainerService
      .updateTrainer(id, name, initials, mobile, address)
      .subscribe((res: any) => {
        alert('saved successfully.');
      });
  }

  createTrainer(
    name: string,
    initials: string,
    mobile: string,
    address: string
  ) {
    this.trainerService
      .createTrainer(name, initials, mobile, address)
      .subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      });
  }
  onEdit(trainer: any) {
    this.trainers().forEach((element: apiTrainerModel) => {
      element.isEdit = false;
    });
    trainer.isEdit = true;
  }

  executeExport() {
    this.utils.exportToExcel('trainer-table', 'Consult-trainer-export');
    // this.exportToExcel('blood-table', 'Consult-bloodGroups-export');
  }
  formRest() {
    this.formSaveTrainer.reset();
  }
}
