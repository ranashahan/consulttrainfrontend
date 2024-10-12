import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainersComponent implements OnInit, OnDestroy {
  /**
   * Form for creating new trainer
   */
  formSaveTrainer = new FormGroup({
    name: new FormControl(),
    initials: new FormControl(),
    mobile: new FormControl(),
    address: new FormControl(),
  });
  /**
   * trainer Signal
   */
  trainers = signal<apiTrainerModel[]>([]);
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];
  /**
   * Constructor
   * @param trainerService trainer service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private utils: UtilitiesService,
    private trainerService: TrainerService
  ) {}
  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Trainers');
    this.getAll();
  }
  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.trainerService.getAllTrainers().subscribe((res: any) => {
        this.trainers.set(res);
      })
    );
  }
  /**
   * This method will update trainer against id
   * @param id {number} trainer id
   * @param name {string} trainer name
   * @param initials {string} trainer initials
   * @param mobile {string} trainer mobile
   * @param address {string} trainer address
   */

  updateTrainer(
    id: number,
    name: string,
    initials: string,
    mobile: string,
    address: string
  ) {
    this.subscriptionList.push(
      this.trainerService
        .updateTrainer(id, name, initials, mobile, address)
        .subscribe((res: any) => {
          alert('saved successfully.');
        })
    );
  }
  /**
   * This method will create new trainer
   * @param name {string} trainer name
   * @param initials {string} trainer initials
   * @param mobile {string} trainer mobile
   * @param address {string} trainer address
   */
  createTrainer(
    name: string,
    initials: string,
    mobile: string,
    address: string
  ) {
    this.subscriptionList.push(
      this.trainerService
        .createTrainer(name, initials, mobile, address)
        .subscribe((res: any) => {
          onmessage = res.message;
          alert(onmessage);
        })
    );
  }
  /**
   * This method will enable editalble fields.
   * @param trainer trainer
   */
  onEdit(trainer: any) {
    this.trainers().forEach((element: apiTrainerModel) => {
      element.isEdit = false;
    });
    trainer.isEdit = true;
  }
  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('trainer-table', 'Consult-trainer-export');
  }
  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveTrainer.reset();
  }
  /**
   * This method will destory all the subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
