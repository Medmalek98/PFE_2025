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

@Component({
  selector: 'app-mes-societe-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule    
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
    const selected = this.societeForm.value.selectedSociete;

    if (selected) {
      const selectedIp = selected.ipadresse;
      console.log('Adresse IP sélectionnée :', selectedIp);
      localStorage.removeItem('selectedSocieteIp');
      localStorage.setItem('selectedSocieteIp', selectedIp);

        this.router.navigate(['/ventes'], {
        queryParams: { ip: selectedIp }
      });
    }

  }
}
  