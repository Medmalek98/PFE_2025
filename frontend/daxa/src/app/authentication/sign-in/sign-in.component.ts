import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavigationEnd, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';

@Component({
    standalone:true ,
    selector: 'app-sign-in',
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {


    usernameOrEmail : string = '' ;
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private authService :AuthService, 
        private tokenService:TokenService,
    ) 
    
    
    {
        this.authForm = this.fb.group({
            email: ['', [Validators.required]],
           password: ['', [Validators.required]],
        });
    }

    // Password Hide
    hide = true;

    
  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation End:', event); // Affiche les événements de navigation
      }
    });
  }

    // Form
    authForm: FormGroup;

    login() {

        const email = this.authForm.get('email')?.value;
        const password = this.authForm.get('password')?.value;

    console.log('Email:', email);
    console.log('Password:', password);

        this.authService.login(email,password).subscribe({
          next: (response) => {
            this.authService.setUsernameOrEmail(this.usernameOrEmail);
            console.log('Login mail:', this.usernameOrEmail);
            this.router.navigate(['/mes-societe-page']);
            console.log('Login successful:', response);
          },
          error: (error) => {
            console.error('Login error:', error);
          },
        });
      }

      refreshToken() {
        this.authService.refreshToken().subscribe({
          next: (response) => {
          },
          error: (error) => {
            console.error('Refresh error:', error);
          },
        });
      }
    

}