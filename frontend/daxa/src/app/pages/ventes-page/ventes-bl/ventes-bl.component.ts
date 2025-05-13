import {  Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { StorageService } from '../../../services/StorageService ';
import { AmountByDateComponent, ChartOptions } from '../amount-by-date/amount-by-date.component';
import { DateRangeRevenueComponent } from '../date-range-income/date-range-income.component';
import { TotalRevenueComponent } from '../total-income/total-income.component';


@Component({
  selector: 'app-stat-vente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AmountByDateComponent,
    TotalRevenueComponent,
    DateRangeRevenueComponent,
  ],
  templateUrl: './ventes-bl.component.html',
  styleUrls: ['./ventes-bl.component.scss']
})
export class VentesBLComponent implements OnInit {
  ventes: any[] = [];
  isChartReady = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  totalRevenue: number = 0;
  totalRevenueInDateRange: number = 0;

  chartOptions: ChartOptions = {
    series: [{ name: 'HT', data: [] }],
    chart: { type: 'line', height: 350 },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false }
  };

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit(): void {
    this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.fetchVentes(value.start, value.end);
      }
    });
  }

  fetchVentes(start: Date, end: Date): void {
    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) {
      console.warn('IP non trouvée dans le StorageService');
      return;
    }

    const debut = start.toLocaleDateString('fr-FR');
    const fin = end.toLocaleDateString('fr-FR');

    const url = `http://${ip}/api/ventesBL?_debut=${debut}&_fin=${fin}`;

    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.ventes = data;

        // Fast sum using loop
        let total = 0;
        for (let i = 0; i < data.length; i++) {
          total += Number(data[i].HT) || 0;
        }
        this.totalRevenue = total;

        this.prepareChartData(data);
      },
      error: err => console.error('Erreur API :', err)
    });
  }

  prepareChartData(data: any[]): void {
    const groupedByDate: { [key: string]: number } = {};

    // Group data by date
    data.forEach((v) => {
      const date = new Date(v.DateBL); 
      const dateKey = date.toISOString().split('T')[0]; // Group by date (yyyy-MM-dd)
      groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + v.HT;
    });

    // Sort dates and limit to 90 days
    const sortedDates = Object.keys(groupedByDate)
                              .sort()
                              .slice(-90); // Get the last 90 days

    const chartValues = sortedDates.map((date) => groupedByDate[date]);

    this.chartOptions.series = [{ name: 'HT', data: chartValues }];
    this.chartOptions.xaxis = { categories: sortedDates };

    this.totalRevenueInDateRange = chartValues.reduce((a, b) => a + b, 0);
    this.isChartReady = true;
}

}
