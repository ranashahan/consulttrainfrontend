import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MastercategoryComponent } from '../../widget/mastercategory/mastercategory.component';
import { SlavecategoryComponent } from '../../widget/slavecategory/slavecategory.component';
import { ActivitiesComponent } from '../../widget/activities/activities.component';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-configureassessment',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MastercategoryComponent,
    SlavecategoryComponent,
    ActivitiesComponent,
  ],
  templateUrl: './configureassessment.component.html',
  styleUrl: './configureassessment.component.css',
})
export class ConfigureassessmentComponent {
  constructor(private Utils: UtilitiesService) {
    Utils.setTitle('Configuration Assessment');
  }
}
