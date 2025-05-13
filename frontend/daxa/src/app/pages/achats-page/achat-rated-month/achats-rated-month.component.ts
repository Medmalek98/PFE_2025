import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { StorageService } from '../../../services/StorageService ';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-achats-rated-month',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './achats-rated-month.component.html',
  styleUrls: ['./achats-rated-month.component.scss']
})
export class AchatsRatedMonthComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  isLoading = false;
  isChartReady = false;
  highestMonth: { name: string; value: number } | null = null;
  chartOptions: any = {
    series: [{ name: 'Inflation Rate', data: [] }],
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    dataLabels: { enabled: true }
  };
  private isBrowser: boolean;

  constructor(
    public themeService: CustomizerSettingsService,
    private http: HttpClient,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3);

    this.range.patchValue({
      start: startDate,
      end: endDate
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.range.valueChanges.subscribe(value => {
        if (value.start && value.end) {
          this.fetchInflationData(value.start, value.end);
        }
      });

      if (this.range.value.start && this.range.value.end) {
        this.fetchInflationData(this.range.value.start, this.range.value.end);
      }
    }
  }

  fetchInflationData(start: Date, end: Date): void {
    if (!this.isBrowser) return;

    this.isLoading = true;
    this.isChartReady = false;
    this.highestMonth = null;

    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) {
      console.warn('IP not found in StorageService');
      this.isLoading = false;
      return;
    }

    const debut = start.toLocaleDateString('fr-FR');
    const fin = end.toLocaleDateString('fr-FR');

    const url = `http://${ip}/api/ACHATS?_debut=${debut}&_fin=${fin}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.prepareChartData(data);
        this.isChartReady = true;
        this.renderChart();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  prepareChartData(data: any[]): void {
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;

    if (!startDate || !endDate) {
      console.warn('Start or end date is null. Aborting chart preparation.');
      this.isLoading = false;
      return;
    }

    const monthlyData: { [key: string]: number } = {};
    const monthOrder: { key: string; timestamp: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const filteredData = data.filter(item => {
      const date = new Date(item.Date);
      return date >= startDate && date <= endDate;
    });

    filteredData.forEach(item => {
      const date = new Date(item.Date);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      const timestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

      if (!monthlyData[key]) {
        monthlyData[key] = 0;
        monthOrder.push({ key, timestamp });
      }

      monthlyData[key] += item.HT;
    });

    const sortedMonths = monthOrder
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(m => m.key);

    const chartData = sortedMonths.map(month => parseFloat(monthlyData[month].toFixed(2)));

    // Find highest month
    if (chartData.length > 0) {
      const maxValue = Math.max(...chartData);
      const maxIndex = chartData.indexOf(maxValue);
      this.highestMonth = {
        name: sortedMonths[maxIndex],
        value: maxValue
      };
    }

    this.chartOptions = {
      series: [{
        name: 'Total HT',
        data: chartData
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: true }
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 8,
          colors: {
            ranges: [{
              from: this.highestMonth?.value || 0,
              to: this.highestMonth?.value || 0,
              color: '#2e7d32'
            }]
          },
          dataLabels: { position: 'top' }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(2) + ' DT',
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
          fontWeight: 600
        }
      },
      xaxis: {
        categories: sortedMonths,
        labels: {
          rotate: -45,
          style: { fontSize: '12px' },
          offsetY: 5
        }
      },
      yaxis: {
        title: {
          text: 'Montant HT (DT)',
          style: { fontSize: '14px' }
        },
        labels: {
          formatter: (val: number) => val.toFixed(1) + ' DT'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          opacityFrom: 0.7,
          opacityTo: 0.9,
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toFixed(2) + ' DT'
        }
      }
    };

    this.isChartReady = sortedMonths.length > 0;
    this.isLoading = false;
  }

  async renderChart(): Promise<void> {
    if (!this.isBrowser || !this.isChartReady) return;

    try {
      const ApexCharts = (await import('apexcharts')).default;
      const chartElement = document.querySelector('#inflation-column-chart');
      if (chartElement && chartElement.innerHTML) {
        chartElement.innerHTML = '';
      }
      const chart = new ApexCharts(chartElement, this.chartOptions);
      chart.render();
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }
}