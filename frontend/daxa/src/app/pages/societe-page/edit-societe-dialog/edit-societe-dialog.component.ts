import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Societe } from '../../../model/societe';

@Component({
  selector: 'app-edit-societe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-societe-dialog.component.html',
  styleUrls: ['./edit-societe-dialog.component.scss']
})
export class EditSocieteDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSocieteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Societe
  ) {
    this.form = this.fb.group({
      societeName: [data.societeName],
      matriculeFiscal: [data.matriculeFiscal],
      debutContract: [data.debutContract],
      finContract: [data.finContract],
      ipadresse: [data.ipadresse],
      nomContact: [data.nomContact],
      numContact: [data.numContact],
    });
  }

  save(): void {
    if (this.form.valid) {
      const updatedSociete: Societe = { ...this.data, ...this.form.value };
      this.dialogRef.close(updatedSociete);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
