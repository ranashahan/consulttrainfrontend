import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DltypeService } from '../../services/dltype.service';
import { UtilitiesService } from '../../services/utilities.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { apiGenericModel } from '../../model/Generic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dltype',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './dltype.component.html',
  styleUrl: './dltype.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DltypeComponent implements OnInit, OnDestroy {
  /**
   * dltype signal
   */
  dltypes = signal<apiGenericModel[]>([]);
  /**
   * Form for creating new visual
   */
  formSaveDLType = new FormGroup({
    type: new FormControl(),
  });
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];
  /**
   * Constructor
   * @param dltypeService dltype service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private dltypeService: DltypeService,
    private utils: UtilitiesService
  ) {}
  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Driver License Type');
    this.getAll();
  }
  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.dltypeService.getAllDLTypes().subscribe((res: any) => {
        this.dltypes.set(res);
      })
    );
  }
  /**
   * This method will update dltype against id
   * @param id {number} dltype id
   * @param dltype {string} dltype name
   */
  updateDLType(id: number, dltype: string) {
    this.subscriptionList.push(
      this.dltypeService.updateDLTypes(id, dltype).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }
  /**
   * This method will create new dltype
   * @param dltype {string} dltype name
   */
  createDLType(dltype: string) {
    this.subscriptionList.push(
      this.dltypeService.createDLTypes(dltype).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }
  /**
   * This method will enable editalble fields.
   * @param dltype dltype
   */
  onEdit(dltype: any) {
    this.dltypes().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    dltype.isEdit = true;
  }
  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('dltype-table', 'Consult-dltypes-export');
  }
  /**
   * This method will reset the form value to blank
   */
  formReset() {
    this.formSaveDLType.reset();
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
