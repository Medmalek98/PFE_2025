import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { StorageService } from '../../../services/StorageService ';
import { debounceTime, filter, distinctUntilChanged, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-achats-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './achats-list.component.html',
  styleUrl: './achats-list.component.scss'
})
export class AchatsListComponent implements OnInit , OnDestroy {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  allRefArticles: { ref: string; qte: number; ht: number; ttc: number }[] = [];
  displayedColumns: string[] = ['ref', 'qte', 'ht', 'ttc'];
  dataSource = new MatTableDataSource<{ ref: string; qte: number; ht: number; ttc: number }>([]);
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
    private destroy$ = new Subject<void>();
    public isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

    private lastRange: { start: Date | null, end: Date | null } = { start: null, end: null };

  constructor(private http: HttpClient, private storageService: StorageService) {}

   ngOnInit(): void {
      this.range.valueChanges.pipe(
        debounceTime(300),
        filter(value => value.start instanceof Date && value.end instanceof Date),
        distinctUntilChanged((prev, curr) => {
          const prevStart = prev.start instanceof Date ? prev.start.getTime() : null;
          const prevEnd = prev.end instanceof Date ? prev.end.getTime() : null;
          const currStart = curr.start instanceof Date ? curr.start.getTime() : null;
          const currEnd = curr.end instanceof Date ? curr.end.getTime() : null;
          return prevStart === currStart && prevEnd === currEnd;
        }),
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.isLoading = true;
        this.fetchData(value.start as Date, value.end as Date);
        this.lastRange = { start: value.start as Date, end: value.end as Date };
      });
    }
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchData(start: Date, end: Date): void {
    const ip = this.storageService.getItem('selectedSocieteIp');
    if (!ip) return;

    const debut = start.toLocaleDateString('fr-FR');
    const fin = end.toLocaleDateString('fr-FR');
    const url = `http://${ip}/api/ACHATS?_debut=${debut}&_fin=${fin}`;

    this.http.get<any[]>(url).subscribe({
      next: data => {
        const map = new Map<string, { qte: number; ht: number; ttc: number }>();

        for (const item of data) {
          const ref = item.RefArticle || 'Inconnu';
          const qte = parseFloat(item.Qte) || 0;
          const ht = parseFloat(item.HT) || 0;
          const ttc = parseFloat(item.TTC) || 0;

          if (!map.has(ref)) {
            map.set(ref, { qte: 0, ht: 0, ttc: 0 });
          }

          const current = map.get(ref)!;
          current.qte += qte;
          current.ht += ht;
          current.ttc += ttc;
        }

        this.allRefArticles = Array.from(map.entries())
          .map(([ref, agg]) => ({ ref, ...agg }))
          .sort((a, b) => b.qte - a.qte);

        this.dataSource.data = this.allRefArticles;
      },
      error: err => console.error('Erreur API :', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
  }

  exportToExcel(): void {
    const ws = XLSX.utils.json_to_sheet(this.allRefArticles);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TopRefArticles');
    XLSX.writeFile(wb, 'TopRefArticles.xlsx');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
