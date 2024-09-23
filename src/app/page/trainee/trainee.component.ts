import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-trainee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainee.component.html',
  styleUrl: './trainee.component.css',
})
export class TraineeComponent implements OnInit {
  url: string = 'trainee.json';
  trainees: any[] = [];
  paginatedTrainees: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 0;
  pages: number[] = [];
  filteredTrainees: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private utils: UtilitiesService) {}

  ngOnInit(): void {
    this.utils.setTitle('All Trainee');
    this.http.get<any[]>(this.url).subscribe((res) => {
      this.trainees = res;
      // this.totalPages = Math.ceil(this.trainees.length / this.itemsPerPage);

      // this.updatePaginatedTrainees();
      this.filterTrainees();
    });
  }
  filterTrainees(): void {
    if (this.searchTerm) {
      this.filteredTrainees = this.trainees.filter((trainee) =>
        trainee.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTrainees = this.trainees;
    }
    this.currentPage = 1; // Reset to the first page
    this.totalPages = Math.ceil(
      this.filteredTrainees.length / this.itemsPerPage
    );
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedTrainees();
  }
  updatePaginatedTrainees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedTrainees = this.filteredTrainees.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTrainees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTrainees();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedTrainees();
  }
  openAssessmentForm(): void {
    // const dialogRef = this.dialog.open(AssessmentFormModalComponent, {
    //   width: '600px',
    //   data: {} // You can pass data here if needed
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed with the result:', result);
    // });
  }
}
