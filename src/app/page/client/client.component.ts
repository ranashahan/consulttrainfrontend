import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  clients: apiClientModel[] = [];
  formSaveClient = new FormGroup({
    name: new FormControl(),
    contactperson: new FormControl(),
    contactnumber: new FormControl(),
    address: new FormControl(),
    website: new FormControl(),
    agentname: new FormControl(),
    agentnumber: new FormControl(),
  });
  constructor(
    private clientService: ClientService,
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.setTitle('Clients');
    this.getAll();
  }

  getAll() {
    this.clientService.getAll().subscribe((res: any) => {
      this.clients = res;
    });
  }

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
      });
  }

  create(
    name: string,
    contactperson: string,
    contactnumber: string,
    address: string,
    website: string,
    agentname: string,
    agentnumber: string
  ) {
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
      });
  }

  onEdit(result: any) {
    this.clients.forEach((element: apiClientModel) => {
      element.isEdit = false;
    });
    result.isEdit = true;
  }
  executeExport() {
    this.utils.exportToExcel('client-table', 'Consult-client-export');
  }
  formRest() {
    this.formSaveClient.reset();
  }
}
