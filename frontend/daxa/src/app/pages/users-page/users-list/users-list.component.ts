import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { User } from '../../../model/user';
import { UserController } from '../../../controller/UserController';
import { NgFor, NgIf } from '@angular/common';
import { ViewUserDialogComponent } from '../view-user-dialog/view-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [
        MatCardModule, MatMenuModule, MatButtonModule, RouterLink,
        MatTableModule, MatPaginatorModule, MatCheckboxModule,
        MatTooltipModule, NgFor, NgIf
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements AfterViewInit {

    displayedColumns: string[] = ['userID', 'username', 'email', 'roles', 'action'];
    dataSource = new MatTableDataSource<User>();
    selection = new SelectionModel<User>(true, []);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        public themeService: CustomizerSettingsService,
        private userController: UserController,
        private dialog: MatDialog
        
    ) {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userController.getUsers().subscribe({
            next: (users: User[]) => {
                this.dataSource.data = users;
            },
            error: (error) => {
                console.error('Failed to load users', error);
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    deleteuser(id: number): void {
        this.userController.deleteUser(id).subscribe({
          next: () => {
            console.log(`User with ID ${id} deleted`);
            this.loadUsers();
          },
          error: err => console.error('Error deleting user', err)
        });
      }

      openViewDialog(user: User): void {
          this.dialog.open(ViewUserDialogComponent, {
            width: '400px',
            data: user
          });
        }


        openEditDialog(user: User): void {
            const dialogRef = this.dialog.open(EditUserDialogComponent, {
              width: '500px',
              data: { ...user }
            });
          
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.userController.updateUser(result).subscribe({
                  next: () => {
                    console.log('✅ User updated successfully');
                    this.loadUsers(); 
                  },
                  error: err => {
                    console.error('❌ Error updating user:', err);
                  }
                });
              }
            });
          }
          
}
