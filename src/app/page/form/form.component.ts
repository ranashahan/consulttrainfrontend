import { Component } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  constructor(private utils: UtilitiesService) {}
  ngOnInit(): void {
    this.utils.setTitle('Input Form');
  }
}
