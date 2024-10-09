import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Menu } from '../../model/Menu';
import { DriverService } from '../../services/driver.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UserprofileComponent } from '../../widget/userprofile/userprofile.component';
import { SignupComponent } from '../../widget/signup/signup.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FooterComponent,
    UserprofileComponent,
    SignupComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  searchControl = new FormControl(); // Reactive form control for search input
  searchResults: any[] = []; // Store search results
  isLoading = false; // Show loading indicator
  @ViewChild(UserprofileComponent) userprofileComponent!: UserprofileComponent;
  @ViewChild(SignupComponent) signupComponent!: SignupComponent;
  dropdownMenus: any = [];
  userRoles: string[] = [];
  constructor(
    private authService: AuthService,
    private driverService: DriverService
  ) {
    this.dropdownMenus = Menu.dropdownMenus;
    this.authService.setUserRole();
    this.userRoles = [this.authService.getUserRole() ?? 'member'];
    this.username = this.authService.getUsername() ?? 'dummyUser';
  }

  username: string = '';

  ngOnInit(): void {
    this.getSearch();
  }

  getSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(600), // Wait for the user to stop typing for 600ms
        switchMap((query) => {
          if (query) {
            this.isLoading = true;
            return this.driverService.GetSearch(query);
          } else {
            // If the query is empty, return an empty array or fetch all
            return [];
          }
        })
      )
      .subscribe((results: any) => {
        if (results) {
          this.isLoading = false;
          this.searchResults = results;
        }
      });
  }

  // Method to clear search results
  clearSearch() {
    this.searchResults = [];
    this.searchControl.setValue(''); // Clear the search input
  }

  onLogOut() {
    this.authService.logout();
  }
  openUserProfileModal() {
    this.userprofileComponent.openModal();
  }
  openSignUpModal() {
    this.signupComponent.openModal();
  }
  canAccess(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }
}
