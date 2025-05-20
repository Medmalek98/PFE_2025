import { Component, OnInit } from '@angular/core';
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

  // In your component.ts file
chartOptions: ChartOptions = {
    series: [{ 
        name: 'HT', 
        data: [],
        color: '#0f79f3' // Using the same blue as your first example
    }],
    chart: {
        type: 'line',
        height: 350,
        foreColor: '#475569', // Text color matching your first example
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false
            }
        },
        background: 'transparent' // Better for theme consistency
    },
    stroke: {
        curve: 'straight', // Matches your first example (was 'smooth')
        width: 2,
        colors: ['#0f79f3']
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: true,
        borderColor: '#e2e8f0', // Light grid color
        strokeDashArray: 5, // Matches first example
        row: {
            colors: ['#f8fafc', 'transparent'], // Very subtle alternating
            opacity: 0.5
        }
    },
    xaxis: {
        categories: [],
        axisBorder: {
            show: false // Cleaner look like first example
        },
        axisTicks: {
            show: true,
            color: '#e2e8f0'
        },
        labels: {
            style: {
                colors: '#64748b', // Matching your first example
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#64748b', // Matching your first example
                fontSize: '12px'
            },
            formatter: (value) => {
                return value.toFixed(2); // Format numbers consistently
            }
        },
        axisBorder: {
            show: false
        }
    },
    tooltip: {
        style: {
            fontSize: '12px',
            fontFamily: 'inherit'
        },
        y: {
            formatter: (value) => {
                return value.toFixed(2); // Consistent decimal places
            }
        }
    }
};

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    public themeService: CustomizerSettingsService
  ) {}

  // Rest of your existing methods remain exactly the same...
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

    const debut = start.toISOString().substring(0, 10);
    const fin = end.toISOString().substring(0, 10);


    const url = `http://${ip}/api/ventesBL?_debut=${debut}&_fin=${fin}`;

    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.ventes = data;
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
    data.forEach((v) => {
      const date = new Date(v.DateBL); 
      const dateKey = date.toISOString().split('T')[0];
      groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + v.HT;
    });

    const sortedDates = Object.keys(groupedByDate)
                            .sort()
                            .slice(-90);

    const chartValues = sortedDates.map((date) => groupedByDate[date]);

    this.chartOptions.series = [{ 
      name: 'HT', 
      data: chartValues,
      color: '#3f88f5' // Maintain consistent color
    }];
    this.chartOptions.xaxis = { 
      ...this.chartOptions.xaxis,
      categories: sortedDates 
    };

    this.totalRevenueInDateRange = chartValues.reduce((a, b) => a + b, 0);
    this.isChartReady = true;
  }
}