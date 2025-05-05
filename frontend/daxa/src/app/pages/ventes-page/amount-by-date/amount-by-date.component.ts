import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ApexGrid,
  ApexMarkers,
  ApexLegend
} from 'ng-apexcharts';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title?: ApexTitleSubtitle;
  yaxis?: ApexYAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  grid?: ApexGrid;
  colors?: string[];
  markers?: ApexMarkers;
  legend?: ApexLegend;
}

@Component({
  selector: 'app-amount-by-date',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgApexchartsModule
  ],
  templateUrl: './amount-by-date.component.html',
  styleUrls: ['./amount-by-date.component.scss']
})
export class AmountByDateComponent {
  @Input() isChartReady!: boolean;
  @Input() chartOptions!: ChartOptions;

  constructor(public themeService: CustomizerSettingsService

  ) { }

}
