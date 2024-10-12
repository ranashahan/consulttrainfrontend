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
import { apiClientModel } from '../../model/Client';
import { ClientService } from '../../services/client.service';
import { UtilitiesService } from '../../services/utilities.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent implements OnInit, OnDestroy {
  /**
   * client signal
   */
  clients = signal<apiClientModel[]>([]);
  /**
   * Form for creating new client
   */
  formSaveClient = new FormGroup({
    name: new FormControl(),
    contactperson: new FormControl(),
    contactnumber: new FormControl(),
    address: new FormControl(),
    website: new FormControl(),
    agentname: new FormControl(),
    agentnumber: new FormControl(),
  });
  /**
   * Subscriptionlist so ngondestory will destory all registered subscriptions.
   */
  subscriptionList: Subscription[] = [];
  /**
   * Constructor
   * @param clientService client service for api calls
   * @param utils utilities service for set page title
   */
  constructor(
    private clientService: ClientService,
    private utils: UtilitiesService
  ) {}
  /**
   * This method will invoke all the methods while rendering the page
   */
  ngOnInit(): void {
    this.utils.setTitle('Clients');
    this.getAll();
  }
  /**
   * This method will fetch all the records from database.
   */
  getAll() {
    this.subscriptionList.push(
      this.clientService.getAll().subscribe((res: any) => {
        this.clients.set(res);
      })
    );
  }
  /**
   * This method will update client against id
   * @param id
   * @param name
   * @param contactperson
   * @param contactnumber
   * @param address
   * @param website
   * @param agentname
   * @param agentnumber
   */
  update(
    id: number,
    name: string,
    contactperson: string,
    contactnumber: string,
    address: string,
    website: string,
    agentname: string,
    agentnumber: string
  ) {
    this.subscriptionList.push(
      this.clientService
        .updateClient(
          name,
          contactperson,
          contactnumber,
          address,
          website,
          agentname,
          agentnumber,
          id
        )
        .subscribe((res: any) => {
          alert('saved successfully.');
        })
    );
  }

  /**
   * This method will create new client
   * @param name
   * @param contactperson
   * @param contactnumber
   * @param address
   * @param website
   * @param agentname
   * @param agentnumber
   */
  create(
    name: string,
    contactperson: string,
    contactnumber: string,
    address: string,
    website: string,
    agentname: string,
    agentnumber: string
  ) {
    this.subscriptionList.push(
      this.clientService
        .createClient(
          name,
          contactperson,
          contactnumber,
          address,
          website,
          agentname,
          agentnumber
        )
        .subscribe((res: any) => {
          onmessage = res.message;
          alert(onmessage);
        })
    );
  }

  /**
   * This method will enable editalble fields.
   * @param client client
   */
  onEdit(client: any) {
    this.clients().forEach((element: apiClientModel) => {
      element.isEdit = false;
    });
    client.isEdit = true;
  }

  /**
   * This method will export to excel
   */
  executeExport() {
    this.utils.exportToExcel('client-table', 'Consult-client-export');
  }

  /**
   * This method will reset the form value to blank
   */
  formRest() {
    this.formSaveClient.reset();
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
