import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { ROLES } from '../../model/Constants';
import { AlertComponent } from '../../widget/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  isAlert: boolean = false;
  alertType = '';
  successMessage = '';
  constructor(
    private router: Router,
    private utils: UtilitiesService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

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
      .subscribe({
        next: (data) => {
          if (data.role == ROLES.GUEST) {
            this.router.navigateByUrl('gdashboard');
          } else {
            this.router.navigateByUrl('dashboard');
          }
        },
        error: (err) => {
          if (this.isAlert) {
            this.isAlert = false;
          }
          this.successMessage = err.message;
          this.alertType = 'danger';
          this.isAlert = true;
        },
      });
  }

  formReset(): void {
    this.formLogin.reset();
  }
}
