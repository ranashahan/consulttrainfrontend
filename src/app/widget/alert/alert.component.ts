import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
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

  @Output() onClosed = new EventEmitter<void>();
  visible: boolean = true;
  alertId: number = 0; // Unique identifier for each alert instance

  ngOnInit(): void {
    // if (this.timeout) {
    //   setTimeout(() => this.closeAlert(), this.timeout);
    // }
    this.resetAlert();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] || changes['type']) {
      this.resetAlert();
    }
  }

  resetAlert(): void {
    this.alertId++;
    this.visible = true;
    if (this.timeout) {
      setTimeout(() => this.closeAlert(this.alertId), this.timeout);
    }
  }

  closeAlert(id: number): void {
    if (this.alertId === id) {
      // Ensure closing the correct alert
      this.visible = false;
      this.onClosed.emit();
    }
  }
}
