// import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexTitleSubtitle, ApexDataLabels } from 'ng-apexcharts';
// import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { StorageService } from '../../services/StorageService ';
// import { NgApexchartsModule } from 'ng-apexcharts';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   stroke: ApexStroke;
//   title: ApexTitleSubtitle;
//   dataLabels: ApexDataLabels;
// };

// @Component({
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatIconModule,
//     MatButtonModule,
//     NgApexchartsModule,
//   ],
//   selector: 'app-ventes',
//   templateUrl: './ventes-page.component.html',
//   styleUrls: ['./ventes-page.component.scss']
// })
// export class VentesComponent implements OnInit {
//   missingIpError: boolean = false;
//   chartOptions!: ChartOptions;
//   isChartReady: boolean = false;
//   selectedDate: Date = new Date();
//   totalRevenue: number = 0;
//   totalRevenueSelectedYear: number = 0;
//   totalRevenueSelectedMonth: number = 0;

//   constructor(
//     private http: HttpClient,
//     public themeService: CustomizerSettingsService,
//     private storageService: StorageService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   ngOnInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       const token = this.storageService.getItem('accessToken');
//       if (token) {
//         this.fetchVentesData();
//       }
//     }
//   }
//   fetchVentesData(): void {
//     const storedIp = localStorage.getItem('selectedSocieteIp');
  
//     if (!storedIp) {
//       this.missingIpError = true;
//       return;
//     }
  
//     this.missingIpError = false;
//     const apiUrl = `http://${storedIp}/api/ventes`;
  
//     this.http.get<any[]>(apiUrl).subscribe({
//       next: (data) => {
//         const groupedByDate: { [key: string]: number } = {};
//         this.totalRevenue = 0;
//         this.totalRevenueSelectedYear = 0;
//         this.totalRevenueSelectedMonth = 0;
  
//         const selectedMonth = this.selectedDate.getMonth();
//         const selectedYear = this.selectedDate.getFullYear();
  
//         data.forEach(item => {
//           const rawDate = item.DO_Date || item.do_Date || item.date;
//           const montant = item.DL_MontantHT || item.dl_MontantHT || 0;
  
//           if (!rawDate) return;
  
//           let parsedDate = new Date(rawDate);
  
//           if (isNaN(parsedDate.getTime())) {
//             const parts = rawDate.split('-');
//             if (parts.length === 3) {
//               const [day, month, year] = parts;
//               parsedDate = new Date(`${year}-${month}-${day}`);
//             }
//           }
  
//           if (isNaN(parsedDate.getTime())) return;
  
//           // 👉 Filtrage ici
//           const itemYear = parsedDate.getFullYear();
//           const itemMonth = parsedDate.getMonth();
  
//           if (itemYear !== selectedYear || itemMonth !== selectedMonth) return;
  
//           const dateKey = parsedDate.toISOString().split('T')[0];
//           groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + montant;
  
//           this.totalRevenue += montant;
//           this.totalRevenueSelectedYear += montant;
//           this.totalRevenueSelectedMonth += montant;
//         });
  
//         const labels = Object.keys(groupedByDate).sort();
//         const dataSeries = labels.map(date => groupedByDate[date]);
  
//         this.chartOptions = {
//           series: [{ name: "Revenue", data: dataSeries }],
//           chart: { height: 350, type: "line", zoom: { enabled: false } },
//           dataLabels: { enabled: false },
//           stroke: { curve: "smooth" },
//           title: { text: "Revenue for selected month", align: "left" },
//           xaxis: { categories: labels }
//         };
  
//         this.isChartReady = true;
//       },
//       error: (err) => {
//         console.error('Erreur de récupération des ventes:', err);
//       }
//     });
//   }
  

//   chosenMonthHandler(event: Date, datepicker: any): void {
//     this.selectedDate = event;
//     this.fetchVentesData();
//     datepicker.close();
//   }

//   chosenYearHandler(event: Date): void {
//     this.selectedDate = new Date(event.getFullYear(), 0);
//     this.fetchVentesData();
//   }
// }

















































// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { NgApexchartsModule } from 'ng-apexcharts';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { FormsModule } from '@angular/forms';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';

// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexTitleSubtitle,
//   ApexDataLabels,
//   ApexStroke
// } from 'ng-apexcharts';
// import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';


// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   title: ApexTitleSubtitle;
//   xaxis: ApexXAxis;
//   stroke: ApexStroke;
//   dataLabels: ApexDataLabels;
// };

// @Component({
//   selector: 'app-stat-vente',
//   standalone: true,
//   imports: [CommonModule ,NgApexchartsModule,MatCardModule, FormsModule, MatSelectModule,MatFormFieldModule, MatDatepickerModule,MatButtonModule ,MatInputModule ], // Ajout du module MatDatepicker
//   templateUrl: './ventes-page.component.html',
//   styleUrls: ['./ventes-page.component.scss']
// })
// export class VentesComponent implements OnInit {
//   ventes: any[] = [];
//   isChartReady = false;
//   selectedDate: Date = new Date();
//   selectedYear: string = '';
//   selectedMonth: number = 0;
//   availableYears: string[] = [];
//   totalRevenue: number = 0;
//   totalRevenueSelectedYear: number = 0;
//   totalRevenueSelectedMonth: number = 0;

  

//   chartOptions: ChartOptions = {
//     series: [{
//       name: 'Montant HT',
//       data: []
//     }],
//     chart: {
//       type: 'line',
//       height: 350
//     },
//     title: {
//       text: 'Amount By Date'
//     },
//     xaxis: {
//       categories: []
//     },
//     stroke: {
//       curve: 'smooth'
//     },
//     dataLabels: {
//       enabled: false
//     }
//   };

//   constructor(
//     private http: HttpClient,
//     public themeService: CustomizerSettingsService,
//   ) {}

//   ngOnInit(): void {
//     const storedIp = localStorage.getItem('selectedSocieteIp');
  
//     if (storedIp) {
//       const apiUrl = `http://${storedIp}/api/ventes`;
//       this.http.get<any[]>(apiUrl).subscribe({
//         next: (data) => {
//           this.ventes = data;
  
//           // Extraire les années uniques
//           const yearSet = new Set(
//             this.ventes.map(v => new Date(v.DO_Date).getFullYear().toString())
//           );
//           this.availableYears = Array.from(yearSet).sort();
          
//           if (this.availableYears.length > 0) {
//             this.selectedYear = this.availableYears[0]; // année par défaut
//             this.prepareChartData(); // préparer les données pour l'année par défaut
//             this.isChartReady = true;
            
//           }
//           this.totalRevenue = this.ventes.reduce((sum, v) => sum + v.DL_MontantHT, 0);

//         },
//         error: (err) => {
//           console.error('Erreur lors de l’appel API :', err);
//         }
//       });
//     } else {
//       console.warn('Aucune adresse IP sélectionnée');
//     }
//   }
  
//   // Gestion de la sélection de l'année
//   chosenYearHandler(normalizedYear: Date) {
//     const ctrlValue = this.selectedDate || new Date();
//     ctrlValue.setFullYear(normalizedYear.getFullYear());
//     this.selectedDate = new Date(ctrlValue);
//   }

//   // Gestion de la sélection du mois
//   chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
//     const ctrlValue = this.selectedDate || new Date();
//     ctrlValue.setMonth(normalizedMonth.getMonth());
//     this.selectedDate = new Date(ctrlValue);
//     datepicker.close();

//     this.selectedYear = this.selectedDate.getFullYear().toString();
//     this.selectedMonth = this.selectedDate.getMonth() + 1;
//     this.prepareChartData(); // Mettre à jour les données du graphique
//   }

//   // Préparer les données pour le graphique
//   prepareChartData(): void {
//     if (!this.selectedYear || !this.selectedMonth) return;
  
//     const groupedByDate: { [key: string]: number } = {};
//     this.totalRevenueSelectedMonth = 0;
//     this.totalRevenueSelectedYear = 0;
  
//     this.ventes.forEach(v => {
//       const date = new Date(v.DO_Date);
//       const year = date.getFullYear();
//       const month = date.getMonth() + 1;
  
//       if (year.toString() === this.selectedYear) {
//         this.totalRevenueSelectedYear += v.DL_MontantHT;
  
//         if (month === this.selectedMonth) {
//           this.totalRevenueSelectedMonth += v.DL_MontantHT;
  
//           const dateKey = date.toISOString().split('T')[0];
//           if (!groupedByDate[dateKey]) {
//             groupedByDate[dateKey] = 0;
//           }
//           groupedByDate[dateKey] += v.DL_MontantHT;
//         }
//       }
//     });
  
//     const sortedDates = Object.keys(groupedByDate).sort();
//     const chartValues = sortedDates.map(date => groupedByDate[date]);
  
//     this.chartOptions.series = [{
//       name: 'Montant HT',
//       data: chartValues
//     }];
//     this.chartOptions.xaxis = {
//       categories: sortedDates
//     };
//   }
  

// }



// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { AmountByDateComponent, ChartOptions } from './amount-by-date/amount-by-date.component'; // <-- updated import
// import { MonthlyRevenueComponent } from './monthly-income/monthly-income.component';
// import { TotalRevenueComponent } from './total-income/total-income.component';
// import { YearlyRevenueComponent } from './yearly-income/yearly-income.component';
// import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

// @Component({
//   selector: 'app-stat-vente',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     AmountByDateComponent,
//     TotalRevenueComponent,
//     YearlyRevenueComponent,
//     MonthlyRevenueComponent,
//   ],
//   templateUrl: './ventes-page.component.html',
//   styleUrls: ['./ventes-page.component.scss']
// })
// export class VentesComponent implements OnInit {
//   ventes: any[] = [];
//   isChartReady = false;
//   selectedDate: Date = new Date();
//   selectedYear: string = '';
//   selectedMonth: number = 0;
//   availableYears: string[] = [];
//   totalRevenue: number = 0;
//   totalRevenueSelectedYear: number = 0;
//   totalRevenueSelectedMonth: number = 0;

//   chartOptions: ChartOptions = {
//     series: [{ name: 'Montant HT', data: [] }],
//     chart: { type: 'line', height: 350 },
//     xaxis: { categories: [] },
//     stroke: { curve: 'smooth' },
//     dataLabels: { enabled: false }
//   };

//   constructor(private http: HttpClient ,
//               public themeService: CustomizerSettingsService
              
//   ) {}

//   ngOnInit(): void {
//     const storedIp = localStorage.getItem('selectedSocieteIp');

//     if (storedIp) {
//       const apiUrl = `http://${storedIp}/api/ventes`;
//       this.http.get<any[]>(apiUrl).subscribe({
//         next: (data) => {
//           this.ventes = data;
//           const yearSet = new Set(this.ventes.map(v => new Date(v.DO_Date).getFullYear().toString()));
//           this.availableYears = Array.from(yearSet).sort();
//           if (this.availableYears.length > 0) {
//             this.selectedYear = this.availableYears[0];
//             this.prepareChartData();
//             this.isChartReady = true;
//           }
//           this.totalRevenue = this.ventes.reduce((sum, v) => sum + v.DL_MontantHT, 0);
//         },
//         error: (err) => console.error('Erreur API :', err)
//       });
//     } else {
//       console.warn('Pas d\'IP stockée.');
//     }
//   }

//   prepareChartData(): void {
//     if (!this.selectedYear || !this.selectedMonth) return;

//     const groupedByDate: { [key: string]: number } = {};
//     this.totalRevenueSelectedMonth = 0;
//     this.totalRevenueSelectedYear = 0;

//     this.ventes.forEach(v => {
//       const date = new Date(v.DO_Date);
//       const year = date.getFullYear();
//       const month = date.getMonth() + 1;

//       if (year.toString() === this.selectedYear) {
//         this.totalRevenueSelectedYear += v.DL_MontantHT;

//         if (month === this.selectedMonth) {
//           this.totalRevenueSelectedMonth += v.DL_MontantHT;

//           const dateKey = date.toISOString().split('T')[0];
//           groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + v.DL_MontantHT;
//         }
//       }
//     });

//     const sortedDates = Object.keys(groupedByDate).sort();
//     const chartValues = sortedDates.map(date => groupedByDate[date]);

//     this.chartOptions.series = [{ name: 'Montant HT', data: chartValues }];
//     this.chartOptions.xaxis = { categories: sortedDates };
//   }

//   onDateChange(newDate: Date) {
//     this.selectedDate = newDate;
//     this.selectedYear = this.selectedDate.getFullYear().toString();
//     this.selectedMonth = this.selectedDate.getMonth() + 1;
//     this.prepareChartData();
//   }
// }


import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AmountByDateComponent, ChartOptions } from './amount-by-date/amount-by-date.component';
import { TotalRevenueComponent } from './total-income/total-income.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { DateRangeRevenueComponent } from './date-range-income/date-range-income.component';
import { StorageService } from '../../services/StorageService ';

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
  templateUrl: './ventes-page.component.html',
  styleUrls: ['./ventes-page.component.scss']
})
export class VentesComponent implements OnInit {
  ventes: any[] = [];
  isChartReady = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  totalRevenue: number = 0;
  totalRevenueInDateRange:number= 0;

  chartOptions: ChartOptions = {
    series: [{ name: 'HT', data: [] }],
    chart: { type: 'line', height: 350 },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false }
  };

  constructor(
    private http: HttpClient,
    public themeService: CustomizerSettingsService,
    private storageService: StorageService,
    private cdRef: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    const storedIp = this.storageService.getItem('selectedSocieteIp');

    if (storedIp) {
      const apiUrl = `http://${storedIp}/api/ventes?debut=2021-01-01T00:00:00&fin=2021-12-31T00:00:00`;
      this.http.get<any[]>(apiUrl).subscribe({
        next: (data) => {
          this.ventes = data;
          this.totalRevenue = data.reduce((sum, v) => sum + v.HT, 0);
          this.isChartReady = true;
          this.cdRef.detectChanges(); 
        },
        error: (err) => console.error('Erreur API :', err)
      });
    } else {
      console.warn('Pas d\'IP stockée.');
    }

    this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.prepareChartData(value.start, value.end);
      }
    });
  }

  prepareChartData(startDate: Date, endDate: Date): void {
    const groupedByDate: { [key: string]: number } = {};
  
    this.ventes.forEach(v => {
      const date = new Date(v.DO_DateLivr);
      if (date >= startDate && date <= endDate) {
        const dateKey = date.toISOString().split('T')[0];
        groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + v.HT;
      }
    });
  
    const sortedDates = Object.keys(groupedByDate).sort();
    const chartValues = sortedDates.map(date => groupedByDate[date]);
  
    this.chartOptions.series = [{ name: 'HT', data: chartValues }];
    this.chartOptions.xaxis = { categories: sortedDates };
  
    this.totalRevenueInDateRange = this.ventes
      .filter(v => {
        const date = new Date(v.DO_DateLivr);
        return date >= startDate && date <= endDate;
      })
      .reduce((sum, v) => sum + v.HT, 0);
  }
  
}

