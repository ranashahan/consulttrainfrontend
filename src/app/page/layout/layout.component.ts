import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
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
import { apiDriverModel } from '../../model/Driver';

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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  searchControl = new FormControl(); // Reactive form control for search input
  searchResults: any[] = []; // Store search results
  isLoading = false; // Show loading indicator

  dropdownMenus: any = [];
  userRoles: string[] = [];
  userForm: FormGroup = new FormGroup({
    userid: new FormControl(
      { value: '0', disabled: true },
      Validators.required
    ),
    username: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    name: new FormControl(''),
    mobile: new FormControl(''),
    profilepic: new FormControl(),
    company: new FormControl(''),
    designation: new FormControl(''),
    role: new FormControl(''),
  });
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private driverService: DriverService
  ) {
    this.dropdownMenus = Menu.dropdownMenus;
    this.authService.setUserRole();
    this.userRoles = [this.authService.getUserRole() ?? 'member'];
  }

  username: string = '';
  userid: string = '';
  retrievedImage: any;

  ngOnInit(): void {
    this.getLoggedinUser();
    this.getSearch();
  }

  getSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for the user to stop typing for 300ms
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

  resetForm() {
    this.getLoggedinUser();
  }

  getLoggedinUser() {
    this.userService
      .getUserByID(this.authService.getUserID())
      .subscribe((res: any) => {
        this.username = res[0].username;
        this.userid = res[0].userid;

        this.userForm.setValue({
          userid: res[0].userid,
          username: res[0].username,
          email: res[0].email,
          name: res[0].name,
          mobile: res[0].mobile,
          profilepic: res[0].profilepic,
          company: res[0].company,
          designation: res[0].designation,
          role: res[0].role,
        });
        // console.log(this.userForm.value);
        // this.convertProfilePicToBase64(this.userForm.value.profilepic.data);
      });
  }

  saveForm() {
    this.userService
      .updateUserByID(
        this.userid,
        this.userForm.value.name,
        this.userForm.value.mobile,
        this.userForm.value.company,
        this.userForm.value.designation,
        this.userForm.value.role
      )
      .subscribe((res: any) => {
        if (res.status === 201) {
        }
      });
  }

  onLogOut() {
    this.authService.logout();
  }
  convertProfilePicToBase64(data: any) {
    const bufferData = data;
    const binary = new Uint8Array(bufferData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );
    this.retrievedImage = btoa(binary); // Base64 encode the binary data
  }
  canAccess(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }
}
