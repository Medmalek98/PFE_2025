import { Component, OnInit, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../services/StorageService ';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

interface Vente {
  RefArticle: string;
  GAMME1: string;
  Qte: number;
}

interface ArticleGroup {
  RefArticle: string;
  gammes: { gamme: string; totalQte: number }[];
  totalQte: number;
}

@Component({
  selector: 'app-article-per-gamme',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatNativeDateModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './article-per-gamme.component.html',
  styleUrls: ['./article-per-gamme.component.scss']
})
export class ArticlePerGammeComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  ventes: Vente[] = [];
  topRefArticles: ArticleGroup[] = [];
  paginatedArticles: ArticleGroup[] = [];

  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isBrowser: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    public themeService: CustomizerSettingsService,
  
 @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  ngOnInit(): void {
    if (this.isBrowser) {
      this.range.valueChanges.subscribe(value => {
        if (value.start && value.end) {
          this.fetchData(value.start, value.end);
        }
      });

      if (this.range.value.start && this.range.value.end) {
        this.fetchData(this.range.value.start, this.range.value.end);
      }
    }
  }



  private fetchData(start: Date, end: Date): void {
        if (!this.isBrowser) return;
    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) {
      console.warn('IP not found');
      return;
    }

    const debut = start.toISOString().substring(0, 10);
    const fin = end.toISOString().substring(0, 10);
    const url = `http://${ip}/api/ventesFAC?_debut=${debut}&_fin=${fin}`;

    this.http.get<Vente[]>(url).subscribe(data => {
      this.ventes = data;
      this.groupByRefArticle();
      this.updatePagination();
    });
  }

  private groupByRefArticle(): void {
    const map: Record<string, Record<string, number>> = {};

    this.ventes.forEach(v => {
      if (!v.RefArticle || !v.GAMME1) return;
      map[v.RefArticle] = map[v.RefArticle] || {};
      map[v.RefArticle][v.GAMME1] = (map[v.RefArticle][v.GAMME1] || 0) + v.Qte;
    });

    this.topRefArticles = Object.entries(map).map(([refArticle, gammesMap]) => {
      const gammesArr = Object.entries(gammesMap)
        .map(([gamme, qty]) => ({ gamme, totalQte: qty }))
        .sort((a, b) => b.totalQte - a.totalQte)
        .slice(0, 10);

      const totalQte = gammesArr.reduce((sum, g) => sum + g.totalQte, 0);

      return { RefArticle: refArticle, gammes: gammesArr, totalQte };
    });

    this.topRefArticles.sort((a, b) => b.totalQte - a.totalQte);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedArticles = this.topRefArticles.slice(startIndex, endIndex);
  }
}
