import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { UserController } from '../../../controller/UserController';
import { AuthService } from '../../../services/AuthService';
import { Societe } from '../../../model/societe'; 
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-mes-societe-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule 
  ],
  templateUrl: './mes-societe-list.component.html',
  styleUrls: ['./mes-societe-list.component.scss']
})
export class MesSocieteListComponent implements OnInit {
  userSocietes: Societe[] = []; 
  societeForm: FormGroup;
  selectedSocietes: Societe[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserController,
    private authService: AuthService,
    public themeService: CustomizerSettingsService,
    private router: Router,
    private dialog: MatDialog
    
  ) {
    this.societeForm = this.fb.group({
      selectedSociete: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.warn('User ID not found!');
      return;
    }

    this.userService.getCurrentUserSocietes().subscribe({
      next: (societes) => {
        this.userSocietes = societes;
        console.log('Sociétés for current user:', societes);
      },
      error: (err) => {
        console.error('Error fetching sociétés:', err);
      }
    });
  }

 onSelectSociete(): void {
  const selected: Societe = this.societeForm.value.selectedSociete;

  if (selected) {
    const today = new Date();
    const finDate = new Date(selected.finContract); // exemple : '2025-06-02'

    // Vérifie si la société est expirée
    if (finDate <= today) {
      alert('Cette société est expirée. Vous ne pouvez pas y accéder.');
      return;
    }

    const selectedIp = selected.ipadresse;
    localStorage.removeItem('selectedSocieteIp');
    localStorage.setItem('selectedSocieteIp', selectedIp);

    this.router.navigate(['/ventes'], {
      queryParams: { ip: selectedIp }
    });
  }
}


isSocieteExpired(societe: Societe): boolean {
  if (!societe.finContract) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore l'heure

  const finDate = new Date(societe.finContract);
  finDate.setHours(0, 0, 0, 0); // ignore aussi l'heure

  return finDate < today; // expirer seulement si la date est avant aujourd'hui
}

 
}
  