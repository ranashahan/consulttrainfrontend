import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent implements OnInit, OnDestroy {
  /**
   * result signal
   */
  results = signal<apiGenericModel[]>([]);

  /**
   * Form for creating new vehicle
   */
  formSaveResult = new FormGroup({
    name: new FormControl(),
  });

  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param resultService result service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private resultService: ResultService,
    private utils: UtilitiesService
  ) {}

  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Results');
    this.getAll();
  }

  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.resultService.getAllResults().subscribe((res: any) => {
        this.results.set(res);
      })
    );
  }

  /**
   * This method will update result against id
   * @param id {number} result id
   * @param name {string} result name
   */
  update(id: number, name: string) {
    this.subscriptionList.push(
      this.resultService.updateResult(id, name).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }

  /**
   * This method will create new result
   * @param name {string} result name
   */
  create(name: string) {
    this.subscriptionList.push(
      this.resultService.createResult(name).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }

  /**
   * This method will enable editalble fields.
   * @param result result
   */
  onEdit(result: any) {
    this.results().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    result.isEdit = true;
  }

  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('result-table', 'Consult-result-export');
  }

  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveResult.reset();
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
