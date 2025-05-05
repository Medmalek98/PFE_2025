import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { User } from '../../../model/user';
import { UserController } from '../../../controller/UserController';
import { ChangeDetectorRef } from '@angular/core';


@Component({
    selector: 'app-team-members',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, NgFor,NgIf ],
    templateUrl: './team-members.component.html',
    styleUrl: './team-members.component.scss'
})
export class TeamMembersComponent {

    teamMemberCard: User[] = [];

    constructor(
        public themeService: CustomizerSettingsService,
        private userController: UserController,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadTeamMembers();
    }

    loadTeamMembers(): void {
        this.userController.getUsers().subscribe({
          next: (users) => {
            console.log('Fetched users:', users);
            this.teamMemberCard = users;
            this.cdr.detectChanges();  
        },
          error: (err) => {
            console.error('Error fetching users:', err);
          }
        });
      }
}
