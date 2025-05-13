import { Component, Inject, PLATFORM_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../services/StorageService ';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-achats-per-article',
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
  templateUrl: './achats-per-article.component.html',
  styleUrls: ['./achats-per-article.component.scss']
})
export class AchatsPerArticleComponent implements OnInit, OnDestroy {
  private charts: { top: ApexCharts | null, bottom: ApexCharts | null } = { top: null, bottom: null };
  private isBrowser: boolean;
  private dateSubscription: Subscription | null = null;
  public isLoading = false;
  public isChartReady = { top: false, bottom: false };
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    public themeService: CustomizerSettingsService,
    private http: HttpClient,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeDateRange();
  }

  private initializeDateRange(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3);
    this.range.patchValue({ start: startDate, end: endDate });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.dateSubscription = this.range.valueChanges.subscribe(value => {
        if (value.start && value.end) {
          this.fetchData(value.start, value.end);
        }
      });

      const start = this.range.value.start;
      const end = this.range.value.end;
      if (start && end) this.fetchData(start, end);
    }
  }

  fetchData(start: Date, end: Date): void {
    if (!this.isBrowser || !start || !end) return;

    this.isLoading = true;
    this.isChartReady = { top: false, bottom: false };

    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) {
      this.isLoading = false;
      return;
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const url = `http://${ip}/api/ACHATS?_debut=${formatDate(start)}&_fin=${formatDate(end)}`;

    console.log('Fetching data from:', url);
    this.http.get<any[]>(url).subscribe({
      next: (data) => this.handleDataSuccess(data),
      error: (err) => this.handleDataError(err)
    });
  }

  private handleDataSuccess(data: any[]): void {
    console.log('Data received:', data);
    this.processChartData(data);
  }

  private handleDataError(err: any): void {
    console.error('API Error:', err);
    this.isLoading = false;
    this.isChartReady = { top: true, bottom: true };
  }

  private processChartData(data: any[]): void {
    const articleCounts = data
      .filter(item => item.RefArticle)
      .reduce((acc: { [key: string]: number }, item) => {
        acc[item.RefArticle] = (acc[item.RefArticle] || 0) + 1;
        return acc;
      }, {});

    const allArticles = Object.entries(articleCounts).sort((a, b) => b[1] - a[1]);
    const totalPurchases = allArticles.reduce((sum, [_, count]) => sum + count, 0);

    // Process Top 10
    const top10 = allArticles.slice(0, 10);
    const top10Total = top10.reduce((sum, [_, count]) => sum + count, 0);
    const top10Percentage = (top10Total / totalPurchases) * 100;

    // Process Bottom 10
    const bottom10 = allArticles.slice(-10);
    const bottom10Total = bottom10.reduce((sum, [_, count]) => sum + count, 0);
    const bottom10Percentage = (bottom10Total / totalPurchases) * 100;

    // Render charts with partial percentages
    this.renderPartialPieChart(
      top10,
      'top',
      `Top 10 Articles (${top10Percentage.toFixed(1)}% of Total Purchases)`,
      totalPurchases
    );

    this.renderPartialPieChart(
      bottom10,
      'bottom',
      `Bottom 10 Articles (${bottom10Percentage.toFixed(1)}% of Total Purchases)`,
      totalPurchases
    );
  }

  private async renderPartialPieChart(
    articles: [string, number][],
    position: 'top' | 'bottom',
    title: string,
    totalPurchases: number
  ): Promise<void> {
    if (!this.isBrowser) return;

    const chartId = `article_pie_chart_${position}`;
    await new Promise(resolve => setTimeout(resolve, 50));
    const chartElement = document.getElementById(chartId);

    if (!chartElement) {
      console.error(`Chart container #${chartId} not found`);
      this.isChartReady[position] = true;
      return;
    }

    try {
      chartElement.style.visibility = 'visible';
      chartElement.style.opacity = '1';
      chartElement.style.height = 'auto';
      chartElement.style.width = 'auto';

      const ApexCharts = (await import('apexcharts')).default;
      const labels = articles.map(([article]) => article);
      const series = articles.map(([_, count]) => count);
      const totalShare = series.reduce((sum, count) => sum + count, 0) / totalPurchases;

      const options = {
        series: series,
        chart: {
          type: 'pie',
          height: 400
        },
        labels: labels,
        title: {
          text: title,
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#475569'
          }
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            expandOnClick: false,
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Shown',
                  formatter: () => `${(totalShare * 100).toFixed(1)}% of all purchases`
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number, { seriesIndex }: any) => {
            const percentage = (series[seriesIndex] / totalPurchases) * 100;
            return `${percentage.toFixed(1)}%`;
          },
          style: {
            fontSize: '12px'
          }
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const percentage = (val / totalPurchases) * 100;
              return `${percentage.toFixed(1)}% of total purchases`;
            }
          }
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { height: 300 },
            legend: { position: 'bottom' }
          }
        }]
      };

      this.charts[position]?.destroy();
      this.charts[position] = new ApexCharts(chartElement, options);
      await this.charts[position]?.render();
    } catch (error) {
      console.error(`Error rendering ${position} chart:`, error);
    } finally {
      this.isChartReady[position] = true;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
    Object.values(this.charts).forEach(chart => chart?.destroy());
  }
}