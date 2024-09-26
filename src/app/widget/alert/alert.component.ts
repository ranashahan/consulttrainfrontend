import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnChanges {
  @Input() message: string = ''; // The message to be displayed in the alert
  @Input() type: string = 'info'; // Bootstrap alert type ('success', 'danger', 'warning', etc.)
  @Input() dismissible: boolean = true; // Whether the alert can be dismissed
  @Input() timeout: number | null = 5000; // Optional timeout for auto-dismiss

  visible: boolean = true;

  ngOnInit(): void {
    if (this.timeout) {
      setTimeout(() => this.closeAlert(), this.timeout);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] || changes['type']) {
      this.resetAlert();
    }
  }

  resetAlert(): void {
    this.visible = true;
    if (this.timeout) {
      setTimeout(() => this.closeAlert(), this.timeout);
    }
  }

  closeAlert(): void {
    this.visible = false;
  }
}
