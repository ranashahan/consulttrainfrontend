import { CommonModule } from '@angular/common';
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
import { apiGenericModel } from '../../model/Generic';
import { TitleService } from '../../services/title.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent implements OnInit, OnDestroy {
  /**
   * title Signal
   */
  titles = signal<apiGenericModel[]>([]);

  /**
   * Form for creating new title
   */
  formSaveTitle = new FormGroup({
    name: new FormControl(),
  });

  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];

  /**
   * Constructor
   * @param titleService title service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private titleService: TitleService,
    private utils: UtilitiesService
  ) {}

  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Titles');
    this.getAll();
  }

  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.titleService.getAllTitles().subscribe((res: any) => {
        this.titles.set(res);
      })
    );
  }

  /**
   * This method will update title against id
   * @param id {number} title id
   * @param name {string} title name
   */
  update(id: number, name: string) {
    this.subscriptionList.push(
      this.titleService.updateTitle(id, name).subscribe((res: any) => {
        alert('saved successfully.');
      })
    );
  }

  /**
   * This method will create new title
   * @param name {string} title name
   */
  create(name: string) {
    this.subscriptionList.push(
      this.titleService.createTitle(name).subscribe((res: any) => {
        onmessage = res.message;
        alert(onmessage);
      })
    );
  }

  /**
   * This method will enable editalble fields.
   * @param title title
   */
  onEdit(title: any) {
    this.titles().forEach((element: apiGenericModel) => {
      element.isEdit = false;
    });
    title.isEdit = true;
  }

  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('title-table', 'Consult-title-export');
  }

  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveTitle.reset();
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
