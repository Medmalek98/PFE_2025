import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { map, forkJoin } from 'rxjs';
import { Societe } from '../../../model/societe';
import { User } from '../../../model/user';
import { SocieteController } from '../../../controller/SocieteController';
import { UserController } from '../../../controller/UserController';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';



interface TreeNode {
  name: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-affectation-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './affectation-list.component.html',
  styleUrls: ['./affectation-list.component.scss']
})
export class AffectationListComponent implements OnInit {
  form: FormGroup;
  societes: Societe[] = [];
  users: User[] = [];
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  affectations: { user: User, societes: Societe[] }[] = [];


  constructor(
    private fb: FormBuilder,
    private societeService: SocieteController,
    private userService: UserController,
   public themeService: CustomizerSettingsService,
    

  ) {
    this.form = this.fb.group({
      selectedSociete: [null],
      selectedUsers: [[]]
    });
  }

  ngOnInit(): void {
    this.loadSocietes();
    this.loadUsers();
    this.loadAssignments();
  }

  loadSocietes() {
    this.societeService.getTotalCompany().subscribe(res => this.societes = res);
  }

  loadUsers() {
    this.userService.getUsers().subscribe(res => this.users = res);
  }

  assignUsersToSociete() {
    const societe = this.form.value.selectedSociete;
    const users = this.form.value.selectedUsers;

    if (!societe || users.length === 0) return;

    const userIds = users.map((u: User) => u.id);
    this.societeService.assignUsersToSociete(societe.id, userIds).subscribe(() => {
      this.loadAssignments();
      this.form.reset();
    });
  }
  loadAssignments() {
    this.userService.getUsers().subscribe(users => {
      const affectationsTemp: { user: User, societes: Societe[] }[] = [];

      const requests = users.map(user =>
        this.userService.getUserSocietes(user.id!).pipe(
          map(societes => ({ user, societes }))
        )
      );

      forkJoin(requests).subscribe(results => {
        this.affectations = results;
      });
    });
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  removeUserFromSociete(societeId: number, userId: number): void {
    this.societeService.removeUserFromSociete(societeId, userId).subscribe({
      next: () => {
        this.loadAssignments();
      },
      error: () => {
        console.error("Error removing user from company");
      }
    });
  }

  confirmRemoveUserFromSociete(
    societeId: number,
    userId: number,
    societeName: string,
    username: string
  ): void {
    const confirmed = confirm(`Are you sure you want to remove the assignment between "${societeName}" and "${username}"?`);
    if (confirmed) {
      this.removeUserFromSociete(societeId, userId);
    }
  }

}
