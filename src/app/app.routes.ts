import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { LayoutComponent } from './page/layout/layout.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { AlldriversComponent } from './page/alldrivers/alldrivers.component';
import { DriverdetailComponent } from './page/driverdetail/driverdetail.component';
import { AdddriverComponent } from './page/adddriver/adddriver.component';
import { AllassessmentsComponent } from './page/allassessments/allassessments.component';
import { DriversreportComponent } from './page/driversreport/driversreport.component';
import { AddassessmentComponent } from './page/addassessment/addassessment.component';
import { AssessmentsreportComponent } from './page/assessmentsreport/assessmentsreport.component';
import { TrainersComponent } from './page/trainers/trainers.component';
import { BloodGroupComponent } from './page/blood-group/blood-group.component';
import { ContractorComponent } from './page/contractor/contractor.component';
import { DltypeComponent } from './page/dltype/dltype.component';
import { LocationComponent } from './page/location/location.component';
import { ResultComponent } from './page/result/result.component';
import { StageComponent } from './page/stage/stage.component';
import { TitleComponent } from './page/title/title.component';
import { VehicleComponent } from './page/vehicle/vehicle.component';
import { VisualComponent } from './page/visual/visual.component';
import { UnauthorizedComponent } from './page/unauthorized/unauthorized.component';
import { ClientComponent } from './page/client/client.component';
import { GuestdashboardComponent } from './page/guestdashboard/guestdashboard.component';
import { ConfigureassessmentComponent } from './page/configureassessment/configureassessment.component';
import { PagenotfoundComponent } from './page/pagenotfound/pagenotfound.component';
import { AssessmentdetailComponent } from './page/assessmentdetail/assessmentdetail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff', 'member'] },
      },
      {
        path: 'gdashboard',
        component: GuestdashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['guest'] },
      },
      {
        path: 'alldrivers',
        component: AlldriversComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff', 'member'] },
      },
      {
        path: 'alldrivers/:id',
        component: DriverdetailComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff', 'member'] },
      },
      {
        path: 'adddriver',
        component: AdddriverComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff'] },
      },
      {
        path: 'driversreport',
        component: DriversreportComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'allassessments',
        component: AllassessmentsComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff', 'member'] },
      },
      {
        path: 'allassessments/:id',
        component: AssessmentdetailComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff', 'member'] },
      },
      {
        path: 'addassessment',
        component: AddassessmentComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager', 'staff'] },
      },
      {
        path: 'assessmentsreport',
        component: AssessmentsreportComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'assessmentsconfigure',
        component: ConfigureassessmentComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'trainer',
        component: TrainersComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'blood',
        component: BloodGroupComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'client',
        component: ClientComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'contractor',
        component: ContractorComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'dltype',
        component: DltypeComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'location',
        component: LocationComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'result',
        component: ResultComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'stage',
        component: StageComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'title',
        component: TitleComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'vehicle',
        component: VehicleComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'visual',
        component: VisualComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'manager'] },
      },
    ],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  { path: '**', component: PagenotfoundComponent },
];
