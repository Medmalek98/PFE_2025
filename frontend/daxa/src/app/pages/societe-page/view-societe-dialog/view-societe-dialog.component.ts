import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Societe } from '../../../model/societe';

@Component({
  selector: 'app-view-societe-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './view-societe-dialog.component.html',
  styleUrls: ['./view-societe-dialog.component.scss']
})
export class ViewSocieteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewSocieteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Societe
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
