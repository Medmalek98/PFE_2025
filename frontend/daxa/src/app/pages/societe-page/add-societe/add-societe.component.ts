import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Societe } from '../../../model/societe';
import { SocieteController } from '../../../controller/SocieteController';


@Component({
  selector: 'app-add-societe',
  imports: [CommonModule,MatCardModule, MatMenuModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FileUploadModule, MatRadioModule, MatCheckboxModule],
  templateUrl: './add-societe.component.html',
  styleUrl: './add-societe.component.scss'
})
export class AddSocieteComponent {

  societeForm: FormGroup;
  multiple: boolean = false; // pour file-upload
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public themeService: CustomizerSettingsService,
    private societeController: SocieteController
  ) {
    this.societeForm = this.fb.group({
      societeName: ['', Validators.required],
      matriculeFiscal: ['', Validators.required],
      debutContract: ['', Validators.required],
      finContract: ['', Validators.required],
      ipadresse: ['', Validators.required],
      nomContact: ['', Validators.required],
      numContact: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.societeForm.valid) {
      const societe: Societe = {
        societeName: this.societeForm.value.societeName,
        matriculeFiscal: this.societeForm.value.matriculeFiscal,
        debutContract: this.societeForm.value.debutContract,
        finContract: this.societeForm.value.finContract,
        ipadresse: this.societeForm.value.ipadresse,
        nomContact: this.societeForm.value.nomContact,
        numContact: this.societeForm.value.numContact,
      };

      this.societeController.addCompany(societe).subscribe({
        next: (createdSociete) => {
          console.log('Société ajoutée avec succès :', createdSociete);
          this.router.navigate(['/societe-page']); 
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout de la société :', err);
        }
      });
    } else {
      console.log('Le formulaire de société est invalide.');
    }
  }

}