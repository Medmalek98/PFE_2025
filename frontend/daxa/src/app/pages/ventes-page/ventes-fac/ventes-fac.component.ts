// import {  Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
// import { StorageService } from '../../../services/StorageService ';
// import { AmountByDateComponent, ChartOptions } from '../amount-by-date/amount-by-date.component';
// import { DateRangeRevenueComponent } from '../date-range-income/date-range-income.component';
// import { TotalRevenueComponent } from '../total-income/total-income.component';


// @Component({
//   selector: 'app-stat-vente',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     AmountByDateComponent,
//     TotalRevenueComponent,
//     DateRangeRevenueComponent,
//   ],
//   templateUrl: './ventes-fac.component.html',
//   styleUrls: ['./ventes-fac.component.scss']
// })
// export class VentesFACComponent implements OnInit {
//   ventes: any[] = [];
//   isChartReady = false;

//   range = new FormGroup({
//     start: new FormControl<Date | null>(null),
//     end: new FormControl<Date | null>(null),
//   });

//   totalRevenue: number = 0;
//   totalRevenueInDateRange: number = 0;

// chartOptions: ChartOptions = {
//     series: [{ 
//         name: 'HT', 
//         data: [],
//         color: '#0f79f3' 
//     }],
//     chart: {
//         type: 'line',
//         height: 350,
//         foreColor: '#475569',
//         toolbar: {
//             show: true,
//             tools: {
//                 download: true,
//                 selection: false,
//                 zoom: false,
//                 zoomin: false,
//                 zoomout: false,
//                 pan: false,
//                 reset: false
//             }
//         },
//         background: 'transparent' 
//     },
//     stroke: {
//         curve: 'straight', 
//         width: 2,
//         colors: ['#0f79f3']
//     },
//     dataLabels: {
//         enabled: false
//     },
//     grid: {
//         show: true,
//         borderColor: '#e2e8f0', 
//         strokeDashArray: 5, 
//         row: {
//             colors: ['#f8fafc', 'transparent'], 
//             opacity: 0.5
//         }
//     },
//     xaxis: {
//         categories: [],
//         axisBorder: {
//             show: false 
//         },
//         axisTicks: {
//             show: true,
//             color: '#e2e8f0'
//         },
//         labels: {
//             style: {
//                 colors: '#64748b', 
//                 fontSize: '12px'
//             }
//         }
//     },
//     yaxis: {
//         labels: {
//             style: {
//                 colors: '#64748b', 
//                 fontSize: '12px'
//             },
//             formatter: (value) => {
//                 return value.toFixed(2); 
//             }
//         },
//         axisBorder: {
//             show: false
//         }
//     },
//     tooltip: {
//         style: {
//             fontSize: '12px',
//             fontFamily: 'inherit'
//         },
//         y: {
//             formatter: (value) => {
//                 return value.toFixed(2); 
//             }
//         }
//     }
// };

//   constructor(
//     private http: HttpClient,
//     private storageService: StorageService,
//     public themeService: CustomizerSettingsService
//   ) {}

//   ngOnInit(): void {
//     this.range.valueChanges.subscribe(value => {
//       if (value.start && value.end) {
//         this.fetchVentes(value.start, value.end);
//       }
//     });
//   }

//   fetchVentes(start: Date, end: Date): void {
//     const ip = this.storageService.getItem('selectedSocieteIp');
//     if (!ip) {
//       console.warn('IP non trouvée dans le StorageService');
//       return;
//     }

//     const debut = start.toLocaleDateString('fr-FR');
//     const fin = end.toLocaleDateString('fr-FR');

//     const url = `http://${ip}/api/ventesFAC?_debut=${debut}&_fin=${fin}`;

//     this.http.get<any[]>(url).subscribe({
//       next: data => {
//         this.ventes = data;

//         // Fast sum using loop
//         let total = 0;
//         for (let i = 0; i < data.length; i++) {
//           total += Number(data[i].HT) || 0;
//         }
//         this.totalRevenue = total;

//         this.prepareChartData(data);
//       },
//       error: err => console.error('Erreur API :', err)
//     });
//   }

//   prepareChartData(data: any[]): void {
//     const groupedByDate: { [key: string]: number } = {};

//     data.forEach((v) => {
//       const date = new Date(v.Date); 
//       const dateKey = date.toISOString().split('T')[0]; 
//       groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + v.HT;
//     });

//     // Sort dates and limit to 90 days
//     const sortedDates = Object.keys(groupedByDate)
//                               .sort()
//                               .slice(-90);

//     const chartValues = sortedDates.map((date) => groupedByDate[date]);

//     this.chartOptions.series = [{ name: 'HT', data: chartValues }];
//     this.chartOptions.xaxis = { categories: sortedDates };

//     this.totalRevenueInDateRange = chartValues.reduce((a, b) => a + b, 0);
//     this.isChartReady = true;
// }

// }


import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/StorageService ';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-spline-area-chart',
    standalone: true,
    imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatInputModule
    ],
   templateUrl: './ventes-fac.component.html',
   styleUrls: ['./ventes-fac.component.scss']
})
export class VentesFACComponent implements OnInit {
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        public themeService: CustomizerSettingsService
    ) {}

   ngOnInit(): void {
    this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.fetchData(value.start, value.end);
      }
    });
  }

    async fetchData(start: Date, end: Date): Promise<void> {
        const ip = this.storageService.getItem('selectedSocieteIp');
        if (!ip) {
            console.warn('IP non trouvée dans le StorageService');
            return;
        }

        const debut = start.toISOString().substring(0, 10);
        const fin = end.toISOString().substring(0, 10);

        try {
            const [salesData, purchasesData] = await Promise.all([
                this.http.get<any[]>(`http://${ip}/api/ventesFAC?_debut=${debut}&_fin=${fin}`).toPromise(),
                this.http.get<any[]>(`http://${ip}/api/ACHATS?_debut=${debut}&_fin=${fin}`).toPromise()
            ]);

            this.prepareChartData(salesData || [], purchasesData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

   async prepareChartData(sales: any[], purchases: any[]): Promise<void> {
    try {
        const saleDataByMonth = this.groupByMonthAndSumHT(sales);
        const purchaseDataByMonth = this.groupByMonthAndSumHT(purchases);

        const startDate = this.range.value.start;
        const endDate = this.range.value.end;

        if (!startDate || !endDate) return;

        const monthsInRange = this.getMonthsBetweenDates(startDate, endDate);

        const saleSeries = monthsInRange.map(month => saleDataByMonth[month] || 0);
        const purchaseSeries = monthsInRange.map(month => purchaseDataByMonth[month] || 0);

        const ApexCharts = (await import('apexcharts')).default;

        const options = {
            series: [
                {
                    name: "sale",
                    data: saleSeries
                },
                {
                    name: "purchase",
                    data: purchaseSeries
                }
            ],
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: false
                }
            },
            colors: ["#00cae3", "#0f79f3"],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded"
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            xaxis: {
                categories: monthsInRange,
                axisBorder: {
                    show: false,
                    color: '#e0e0e0'
                },
                axisTicks: {
                    show: true,
                    color: '#e0e0e0'
                },
                labels: {
                    show: true,
                    style: {
                        colors: "#919aa3",
                        fontSize: "14px"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "Montant (Dinars)",
                    style: {
                        color: "#475569",
                        fontSize: "14px",
                        fontWeight: 500
                    }
                },
                labels: {
                    show: true,
                    style: {
                        colors: "#919aa3",
                        fontSize: "14px"
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function(val: number) {
                        return val.toFixed(2) + " Dinars";
                    }
                }
            },
            legend: {
                show: true,
                offsetY: 5,
                fontSize: '14px',
                position: "bottom",
                horizontalAlign: "center",
                labels: {
                    colors: "#919aa3"
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5
                }
            },
            grid: {
                show: true,
                strokeDashArray: 5,
                borderColor: "#e0e0e0"
            }
        };

        const chartElement = document.querySelector('#column_chart');
        if (chartElement) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new ApexCharts(chartElement, options);
            this.chart.render();
        }
    } catch (error) {
        console.error('Error preparing chart data:', error);
    }
}

    private groupByMonthAndSumHT(data: any[]): { [month: string]: number } {
        return data.reduce((acc, item) => {
            const date = new Date(item.Date);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += item.HT / 1000;
            return acc;
        }, {});
    }

    private getMonthsBetweenDates(startDate: Date, endDate: Date): string[] {
        const months = [];
        const currentDate = new Date(startDate);
        currentDate.setDate(1);
        
        while (currentDate <= endDate) {
            months.push(currentDate.toLocaleString('default', { month: 'short' }));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return months;
    }

    private chart: any;
}
