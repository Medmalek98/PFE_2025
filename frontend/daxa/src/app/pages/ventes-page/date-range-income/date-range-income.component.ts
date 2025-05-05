import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-date-range-revenue',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-content>
        <h5>Range Date Income</h5>
        <div>{{ totalRevenueInDateRange }}</div>
      </mat-card-content>
    </mat-card>
  `
})
export class DateRangeRevenueComponent {
  @Input() totalRevenueInDateRange!: number;

  constructor(public themeService: CustomizerSettingsService) {}
}
