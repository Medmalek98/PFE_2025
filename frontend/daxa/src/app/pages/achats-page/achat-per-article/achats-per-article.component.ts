import { Component, Inject, PLATFORM_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private dateSubscription: Subscription | null = null;
  public isLoading = false;
  public isChartReady = { top: false, bottom: false };
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

    constructor(private http: HttpClient, 
      private storageService: StorageService,
      public themeService :CustomizerSettingsService
    ) {}

  ngOnInit(): void {
    this.range.valueChanges.subscribe(value => {
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
    const url = `http://${ip}/api/ACHATS?_debut=${debut}&_fin=${fin}`;

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
    this.isChartReady = { top: true, bottom: true };
  }

private processChartData(data: any[]): void {
  const articleQuantities = data
    .filter(item => item.RefArticle && item.Qte)
    .reduce((acc: { [key: string]: number }, item) => {
      acc[item.RefArticle] = (acc[item.RefArticle] || 0) + item.Qte;
      return acc;
    }, {});

  const allArticles = Object.entries(articleQuantities)
    .sort((a, b) => b[1] - a[1]);

  const totalQte = allArticles.reduce((sum, [_, qte]) => sum + qte, 0);

  const top10 = allArticles.slice(0, 10);
  const top10Total = top10.reduce((sum, [_, qte]) => sum + qte, 0);
  const othersTotal = totalQte - top10Total;

  const finalArticles: [string, number][] = [...top10];
  if (othersTotal > 0) {
    finalArticles.push(['Others', othersTotal]);
  }

  this.renderCombinedPieChart(
    finalArticles,
    'top',
    `Top 10 Articles Purchased + Others (Total Qty: ${totalQte})`,
    totalQte
  );
}


 private async renderCombinedPieChart(
  articles: [string, number][],
  position: 'top' | 'bottom',
  title: string,
  totalQte: number
): Promise<void> {

  const chartId = `article_pie_chart_${position}`;
  const chartElement = document.getElementById(chartId);

  if (!chartElement) {
    console.error(`Chart container #${chartId} not found`);
    this.isChartReady[position] = true;
    return;
  }

  try {
    const ApexCharts = (await import('apexcharts')).default;
    const labels = articles.map(([article]) => article);
    const series = articles.map(([_, qte]) => qte);

    const options = {
      series: series,
      chart: { type: 'pie', height: 400 },
      labels: labels,
      title: { text: title },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const percentage = (val / totalQte) * 100;
            return `${val} units (${percentage.toFixed(1)}%)`;
          }
        }
      }
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