export interface apiContractorModel {
  id: number;
  name: string;
  ntnnumber: string;
  contactname: string;
  contactnumber: string;
  contactdesignation: string;
  contactdepartment: string;
  address: string;
  initials: string;
  clientnames: string;
  clientids: string[];
  createdby: number;
  modifiedby: number;
  created_at: string;
  modified_at: string;
  isEdit: boolean;
  message: string;
}
