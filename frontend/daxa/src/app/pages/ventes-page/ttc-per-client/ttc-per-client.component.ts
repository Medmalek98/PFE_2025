import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../services/StorageService ';

@Component({
  selector: 'app-ttc-per-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './ttc-per-client.component.html',
  styleUrl: './ttc-per-client.component.scss'
})
export class TtcPerClientComponent implements OnInit, OnDestroy {
  private chart: ApexCharts | null = null;
  private dateSubscription: Subscription | null = null;
  public isLoading = false;
  public isChartReady = false;

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private http: HttpClient, 
    private storageService: StorageService,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit(): void {
    this.dateSubscription = this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.fetchData(value.start, value.end);
      }
    });
  }

  fetchData(start: Date, end: Date): void {
    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) return;

    const debut = start.toLocaleDateString('fr-FR');
    const fin = end.toLocaleDateString('fr-FR');
    const url = `http://${ip}/api/ventesFAC?_debut=${debut}&_fin=${fin}`;

    this.isLoading = true;
    this.isChartReady = false;

    this.http.get<any[]>(url).subscribe({
      next: (data) => this.handleDataSuccess(data),
      error: (err) => this.handleDataError(err)
    });
  }

  private handleDataSuccess(data: any[]): void {
    this.processChartData(data);
  }

  private handleDataError(err: any): void {
    console.error('API Error:', err);
    this.isLoading = false;
    this.isChartReady = true;
  }

  private processChartData(data: any[]): void {
    const clientQuantities = data
      .filter(item => item.CT_Intitule && item.TTC)
      .reduce((acc: { [key: string]: number }, item) => {
        acc[item.CT_Intitule] = (acc[item.CT_Intitule] || 0) + item.TTC;
        return acc;
      }, {});

    const allclients = Object.entries(clientQuantities)
      .sort((a, b) => b[1] - a[1]);

    const totalTTC = allclients.reduce((sum, [_, TTC]) => sum + TTC, 0);

    const top10 = allclients.slice(0, 10);
    const top10Total = top10.reduce((sum, [_, TTC]) => sum + TTC, 0);
    const othersTotal = totalTTC - top10Total;

    const finalclients: [string, number][] = [...top10];
    if (othersTotal > 0) {
      finalclients.push(['Others', othersTotal]);
    }

    this.renderPieChart(
      finalclients,
      `Top 10 clients Sold + Others (Total TTC : ${totalTTC})`,
      totalTTC
    );
  }

  private async renderPieChart(
    clients: [string, number][],
    title: string,
    totalTTC: number
  ): Promise<void> {
    const chartId = 'Client_pie_chart';

    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Chart container #${chartId} not found`);
      this.isChartReady = true;
      return;
    }

    try {
      const ApexCharts = (await import('apexcharts')).default;
      const labels = clients.map(([client]) => client);
      const series = clients.map(([_, TTC]) => TTC);

      const options = {
        series: series,
        chart: { type: 'pie', height: 400 },
        labels: labels,
        title: { text: title },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const percentage = (val / totalTTC) * 100;
              return `${val} dinars (${percentage.toFixed(1)}%)`;
            }
          }
        }
      };

      this.chart?.destroy();
      this.chart = new ApexCharts(chartElement, options);
      await this.chart.render();
    } catch (error) {
      console.error('Error rendering chart:', error);
    } finally {
      this.isChartReady = true;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
    this.chart?.destroy();
  }
}
