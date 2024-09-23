export interface apiUserModel {
  userid: number;
  username: string;
  email: string;
  password: string;
  name: string;
  mobile: string;
  profilepic: Profilepic;
  company: string;
  designation: string;
  role: string;
  createdby: string;
  modifiedby: string;
  createdDate: string;
  modifiedDate: string;
}

interface Profilepic {
  type: Blob;
  data: any[];
}
