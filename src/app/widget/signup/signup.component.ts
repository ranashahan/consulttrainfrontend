import { Component, Signal, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UtilitiesService } from '../../services/utilities.service';
import { AlertComponent } from '../alert/alert.component';
declare var bootstrap: any;
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  formSignUp: FormGroup;

  isAlert: boolean = false;
  alertType = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private Utils: UtilitiesService
  ) {
    this.formSignUp = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      mobile: [''],
      company: [''],
      designation: [''],
      imagepath: [''],
      role: ['', Validators.required],
    });
    this.getRoles();
  }

  roles: string[] = [];
  getRoles() {
    this.roles = this.Utils.roles();
  }

  /**
   * SignUp method
   */
  onSignUp() {
    this.userService.createUser(this.formSignUp.value).subscribe({
      next: (data) => {
        if (this.isAlert) {
          this.isAlert = false;
        }
        this.successMessage = data.message.toString();
        this.alertType = 'success';
        this.isAlert = true;
        this.formReset();
      },
      error: (err) => {
        console.error('Error creating driver:', err.message); // Display the error message
        if (this.isAlert) {
          this.isAlert = false;
        }
        this.successMessage = err.message;
        this.alertType = 'danger';
        this.isAlert = true;
      },
    });
  }

  formReset() {
    this.formSignUp.reset();
  }
  openModal() {
    this.formReset();
    const modalElement = document.getElementById('signupModel');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      console.error('Modal element not found');
    }
  }
}
