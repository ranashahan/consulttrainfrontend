export interface apiDriverModel {
  id: number;
  name: string;
  dob: string;
  nic: string;
  licensenumber: string;
  licensetypeid: number;
  licenseexpiry: Date;
  designation: string;
  department: string;
  permitnumber: string;
  permitissue: Date;
  permitexpiry: Date;
  bloodgroupid: number;
  contractorid: number;
  formcount: number;
  createdby: string;
  isEdit: boolean;
}
