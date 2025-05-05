import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { UserController } from '../../../controller/UserController';
import { User } from '../../../model/user';

@Component({
    selector: 'app-add-user',
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FileUploadModule, MatRadioModule, MatCheckboxModule],
    templateUrl: './add-user.component.html',
    styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

    // File Uploader
    public multiple: boolean = false;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private userController: UserController
        ) {
            this.authForm = this.fb.group({
                name: ['', Validators.required],
                email: ['', [Validators.required]],
                password: ['', [Validators.required]],
                username: ['', Validators.required],
                roles: [[], Validators.required] 
            });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    onSubmit() {
        const name = this.authForm.get('name')?.value;
        const email = this.authForm.get('email')?.value;
    const password = this.authForm.get('password')?.value;
    const username = this.authForm.get('username')?.value;
    const roles = this.authForm.get('roles')?.value;

    console.log('Email:', email);
    console.log('Password:', password);
    console.log('name:', name);
    console.log('username:', username);
    console.log('roles:', roles);

        if (this.authForm.valid) {
          const user: User = {
            name: this.authForm.value.name,
            email: this.authForm.value.email,
            password: this.authForm.value.password,
            username: this.authForm.value.username,
            roles: this.authForm.value.roles.map((role: string) => ({ name: role }))
          };
      
          this.userController.addUser(user).subscribe({
            next: (createdUser) => {
              console.log('User registered successfully:', createdUser);
              this.router.navigate(['/users/users-list']);
            },
            error: (err) => {
              console.error('Error registering user:', err);
            }
          });
        } else {
          console.log('Form is invalid. Please check the fields.');
        }
      }

      onRoleChange(event: any, role: string) {
        const currentRoles = this.authForm.value.roles as string[];
        if (event.checked) {
          this.authForm.patchValue({ roles: [...currentRoles, role] });
        } else {
          this.authForm.patchValue({ roles: currentRoles.filter(r => r !== role) });
        }
      }
      
      
}