import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-total-revenue',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-content>
        <h5>Total income</h5>
        <div>{{ totalRevenue }}</div>
      </mat-card-content>
    </mat-card>
  `
})
export class TotalRevenueComponent {
  @Input() totalRevenue!: number;

  constructor(
    public themeService: CustomizerSettingsService
  ) { }
}
