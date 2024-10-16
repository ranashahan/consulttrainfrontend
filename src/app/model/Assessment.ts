import { apiCategoryModel } from './Category';

export interface apiAssessmentModel {
  id: number;
  name: string;
  initials: string;
  scoreInitial?: number;
  scoreMiddle?: number;
  scoreFinal?: number;
}

export interface apiAssessmentFormModel {
  sessionName: string;
  sessionDate: string;
  locationId: number;
  resultId: string;
  stageId: number;
  titleId: string;
  vehicleId: string;
  totalScore: number;
  classdate: string;
  yarddate: string;
  weather: string;
  traffic: string;
  route: string;
  userid: number;
  driverId: number;
  trainer: [];
  trainerIds: string;
  categories: apiCategoryModel[];
  assessmentData: AssessmentData[];
  message: string;
}
interface AssessmentData {
  data: Datum[];
  totalScore: number;
}
interface Datum {
  slavecategoryid: number;
  activityid: number;
  assessmenttype: string;
  score: number;
  assessmentdate: string;
}

export interface apiSessionModel {
  id: number;
  name: string;
  sessiondate: string;
  locationid: any;
  resultid: any;
  stageid: any;
  titleid: any;
  vehicleid: any;
  totalscore: number;
  classdate: any;
  yarddate: any;
  weather: any;
  traffic: any;
  route: any;
  active: number;
  createdby: number;
  modifiedby: number;
  created_at: string;
  modified_at: string;
  contractorid: number;
  message: string;
  nic: string;
  drivername: string;
  driverid: number;
  trainers: string;
}
