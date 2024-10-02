import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../alert/alert.component';
import { UtilitiesService } from '../../services/utilities.service';
declare var bootstrap: any;
@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
})
export class UserprofileComponent {
  formUser: FormGroup;
  private userid: number = 0;
  isAlert: boolean = false;
  alertType = '';
  successMessage = '';

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private Utils: UtilitiesService
  ) {
    this.formUser = this.fb.group({
      userid: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      name: [''],
      mobile: [],
      company: [''],
      designation: [''],
      imagepath: [''],
      role: [''],
    });
    this.getLoggedinUser();
    this.getRoles();
  }

  getLoggedinUser() {
    this.userService
      .getUserByID(this.authService.getUserID())
      .subscribe((res: any) => {
        this.formUser.patchValue(res[0]);
        // this.username = res[0].username;
        this.userid = res[0].userid;
      });
  }

  saveForm() {
    this.userService
      .updateUserByID(
        this.userid,
        this.formUser.value.name,
        this.formUser.value.mobile,
        this.formUser.value.company,
        this.formUser.value.designation,
        this.formUser.value.imagepath,
        this.formUser.value.role
      )
      .subscribe({
        next: (data) => {
          if (this.isAlert) {
            this.isAlert = false;
          }
          this.successMessage = 'User saved successfully';
          this.alertType = 'success';
          this.isAlert = true;
          this.formReset();
        },
        error: (err) => {
          console.error('Error updating user:', err.message); // Display the error message
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
    this.getLoggedinUser();
  }
  openModal() {
    this.formReset();
    const modalElement = document.getElementById('userprofile');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      console.error('Modal element not found');
    }
  }
  roles: string[] = [];
  getRoles() {
    this.roles = this.Utils.roles();
  }
}
