import { Component, Inject ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../model/user';
import { Role } from '../../../model/role';
import { RoleController } from '../../../controller/RoleController';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';


@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,  
    MatOptionModule  
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent {
  form: FormGroup;
  hide = true;
  rolesList: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private roleController : RoleController,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public themeService: CustomizerSettingsService,

  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      email: [data.email, [Validators.required]],
      username: [data.username, Validators.required],
      password: [data.password, [Validators.required]],
      role: [data.roles?.[0]?.name || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.roleController.getRole().subscribe({
      next: (roles: Role[]) => {
        this.rolesList = roles;
        const currentRoleName = this.data.roles?.[0]?.name;
        if (currentRoleName) {
          this.form.patchValue({ role: currentRoleName });
        }
      },
      error: (err) => console.error('❌ Failed to load roles', err)
    });
  }

  save(): void {
    if (this.form.valid) {
      const updatedUser: User = {
        ...this.data,
        ...this.form.value,
        roles: [{ name: this.form.value.role }]
      };
      this.dialogRef.close(updatedUser);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
