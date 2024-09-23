import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { apiUserModel } from '../../model/User';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  bSuccess: boolean = false;
  bLoader: boolean = false;
  successMsg: string = 'Not Created';

  formLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  formSignUp = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    name: new FormControl(),
    mobile: new FormControl(),
    profilepic: new FormControl(),
    company: new FormControl(),
    designation: new FormControl(),
    role: new FormControl(),
  });

  constructor(private router: Router, private utils: UtilitiesService) {}

  /**
   * Injections
   */
  http = inject(HttpClient);
  userService = inject(UsersService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.utils.setTitle('Welcome Consult & Train');
  }

  /**
   * Login method
   */
  onLogin() {
    this.authService
      .login(
        this.formLogin.value.email ?? 'empty',
        this.formLogin.value.password ?? 'empty'
      )
      .subscribe((res: any) => {
        this.router.navigateByUrl('dashboard');
      });
  }

  /**
   * SignUp method
   */
  onSignUp() {
    this.bLoader = true;

    this.userService
      .createUser(
        <apiUserModel>this.formSignUp.value.username,
        this.formSignUp.value.email,
        this.formSignUp.value.password,
        this.formSignUp.value.name,
        this.formSignUp.value.mobile,
        this.formSignUp.value.profilepic,
        this.formSignUp.value.company,
        this.formSignUp.value.designation,
        this.formSignUp.value.role
      )
      .subscribe((res: any) => {
        this.successMsg = res.message;
        this.bSuccess = true;
        this.bLoader = false;
      });
  }

  formRest() {
    this.bSuccess = false;
    this.formSignUp.reset();
  }
}
