import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageComponent implements OnInit, OnDestroy {
  /**
   * stage Signal
   */
  stages = signal<apiGenericModel[]>([]);
  /**
   * Form for creating new stage
   */
  formSaveStage = new FormGroup({
    name: new FormControl(),
  });
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param stageService stage service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private stageService: StageService,
    private utils: UtilitiesService
  ) {}

  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Stages');
    this.getAll();
  }

  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.stageService.getAllStages().subscribe((res: any) => {
        this.stages.set(res);
      })
    );
  }

  /**
   * This method will update stage against id
   * @param id {number} stage id
   * @param name {string} stage name
   */
  update(id: number, name: string) {
    this.subscriptionList.push(
      this.stageService.updateStage(id, name).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }

  /**
   * This method will create new stage
   * @param name {string} stage name
   */
  create(name: string) {
    this.subscriptionList.push(
      this.stageService.createStage(name).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }

  /**
   * This method will enable editalble fields.
   * @param stage stage
   */
  onEdit(stage: any) {
    this.stages().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    stage.isEdit = true;
  }

  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('stage-table', 'Consult-stage-export');
  }

  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveStage.reset();
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
