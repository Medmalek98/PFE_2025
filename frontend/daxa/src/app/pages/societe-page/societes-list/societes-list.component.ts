import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Societe } from '../../../model/societe';
import { SocieteController } from '../../../controller/SocieteController';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditSocieteDialogComponent } from '../edit-societe-dialog/edit-societe-dialog.component';
import { ViewSocieteDialogComponent } from '../view-societe-dialog/view-societe-dialog.component';

@Component({
  selector: 'app-societe-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatMenuModule, MatButtonModule, RouterLink,
    MatTableModule, MatPaginatorModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatDialogModule
  ],
  templateUrl: './societes-list.component.html',
  styleUrl: './societes-list.component.scss'
})
export class SocieteListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'societeName', 'matriculeFiscal', 'debutContract', 'finContract', 'ipadresse', 'nomContact', 'numContact', 'action'];
  dataSource = new MatTableDataSource<Societe>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public themeService: CustomizerSettingsService,
    private societeController: SocieteController,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadSocietes();
  }

  loadSocietes(): void {
    this.societeController.getTotalCompany().subscribe({
      next: (societes: Societe[]) => {
        this.dataSource.data = societes;
      },
      error: (error) => {
        console.error('Failed to load societes', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateSociete(societe: Societe): void {
    this.societeController.updateSociete(societe).subscribe({
      next: () => {
        console.log(`Societe with ID ${societe.id} updated`);
        this.loadSocietes();
      },
      error: (err) => {
        console.error('Error updating Societe', err);
      }
    });
  }

  deleteSociete(id: number): void {
    this.societeController.deleteSociete(id).subscribe({
      next: () => {
        console.log(`Societe with ID ${id} deleted`);
        this.loadSocietes();
      },
      error: err => console.error('Error deleting Societe', err)
    });
  }

  openEditDialog(societe: Societe): void {
    const dialogRef = this.dialog.open(EditSocieteDialogComponent, {
      width: '500px',
      data: { ...societe }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSociete(result);
      }
    });
  }

  openViewDialog(societe: Societe): void {
    this.dialog.open(ViewSocieteDialogComponent, {
      width: '400px',
      data: societe
    });
  }
}
