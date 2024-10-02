import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { SignupComponent } from '../../widget/signup/signup.component';
import { ROLES } from '../../model/Constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SignupComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  @ViewChild(SignupComponent) signupComponent!: SignupComponent;
  formLogin: FormGroup;

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
      .subscribe((res: any) => {
        console.log(res);
        if (res.role == ROLES.GUEST) {
          this.router.navigateByUrl('gdashboard');
        } else {
          this.router.navigateByUrl('dashboard');
        }
      });
  }

  openSignUpModal() {
    this.signupComponent.openModal();
  }
}
