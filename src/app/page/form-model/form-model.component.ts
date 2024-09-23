import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form-model',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-model.component.html',
  styleUrl: './form-model.component.css',
})
export class FormModelComponent {
  assessmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.assessmentForm = this.fb.group({
      name: [''],
      designation: [''],
      birthDate: [''],
      dlNo: [''],
      dlType: [''],
      dlExpiry: [''],
      // Add more fields as needed
    });
  }

  onSubmit(): void {
    if (this.assessmentForm.valid) {
      console.log(this.assessmentForm.value);
      // Perform further actions, such as closing the modal or submitting data
    }
  }
}
