import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.css',
})
export class PagenotfoundComponent implements OnInit {
  constructor(private utils: UtilitiesService) {}
  ngOnInit(): void {
    this.utils.setTitle('Page Not Found');
  }
}
