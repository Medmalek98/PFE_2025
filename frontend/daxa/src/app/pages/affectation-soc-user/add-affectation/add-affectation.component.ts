import { Component, Inject } from '@angular/core';
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
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { SocieteController } from '../../../controller/SocieteController';
import { UserController } from '../../../controller/UserController';
import { Societe } from '../../../model/societe';
import { User } from '../../../model/user';

@Component({
  selector: 'app-add-affectation',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatMenuModule, MatButtonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    ReactiveFormsModule, FileUploadModule, MatRadioModule, MatCheckboxModule, MatStepperModule
  ],
  templateUrl: './add-affectation.component.html',
  styleUrls: ['./add-affectation.component.scss']
})
export class AddAffectationComponent {

  societeForm: FormGroup;
  userForm: FormGroup;
  hide = true;
  multiple: boolean = false;
  data = {
  societe: {} as Societe,
  user: {} as User
};


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public themeService: CustomizerSettingsService,
    private societeController: SocieteController,
    private userController: UserController,
  ) {
    
    this.societeForm = this.fb.group({
      societeName: [this.data.societe.societeName, Validators.required],
      matriculeFiscal: [this.data.societe.matriculeFiscal, Validators.required],
      debutContract: [this.data.societe.debutContract, Validators.required],
      finContract: [this.data.societe.finContract, Validators.required],
      ipadresse: [this.data.societe.ipadresse, Validators.required],
      nomContact: [this.data.societe.nomContact, Validators.required],
      numContact: [this.data.societe.numContact, Validators.required],
    }); 

    this.userForm = this.fb.group({
      name: [this.data.user.name, Validators.required],
      email: [this.data.user.email, [Validators.required]],
      password: [this.data.user.password, [Validators.required]],
      username: [this.data.user.username, Validators.required],
      roles: [[], Validators.required]
    });
  }

  validateForms() {
    if (this.societeForm.valid && this.userForm.valid) {
      alert('Les formulaires sont valides. Veuillez passer à l\'affectation.');
    } else {
      console.log('Un des deux formulaires est invalide.');
    }
  }

  assignUserToSociete() {
    if (this.societeForm.valid && this.userForm.valid) {
      const societe: Societe = this.societeForm.value;
      const user: User = this.userForm.value;

      // Add the company first
      this.societeController.addCompany(societe).subscribe({
        next: (createdSociete) => {
          this.data.societe = createdSociete; 

          // Add the user
          this.userController.addUser(user).subscribe({
            next: (createdUser) => {
              this.data.user = createdUser;  

              const userIds = [this.data.user.id].filter((id): id is number => id !== undefined);
              const societeId = this.data.societe.id;

              // Assign user to company
              if (societeId != null && userIds[0] != null) {
                this.societeController.assignUsersToSociete(societeId, userIds).subscribe({
                  next: () => {
                    alert(`Société '${this.data.societe.societeName}' affectée à l’utilisateur '${this.data.user.username}' avec succès.`);
                    this.router.navigate(['/affectation-soc-user/affectation-list']); 
                  },
                  error: (err) => console.error("Erreur d'affectation :", err)
                });
              }
            },
            error: (err) => console.error("Erreur lors de l'ajout de l'utilisateur :", err)
          });
        },
        error: (err) => console.error("Erreur lors de l'ajout de la société :", err)
      });
    } else {
      console.log("Formulaires invalides");
    }
  }
}
