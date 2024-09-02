import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  public listUsers: Array<User> = [];

  constructor(
    private userService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.listAll().subscribe((res) => {
      this.listUsers = res;
    });
  }

  public removerUser(userId: any) {
    if (!window.confirm(`Deseja excluir o usuário de id: ${userId} ?`)) {
      return;
    }

    this.userService.delete(userId).subscribe(
      (res) => {
        this.toastr.success(`Usuário de ID ${userId} excluído com sucesso!`);
        this.listUsers = this.listUsers.filter((e) => e.id !== userId);
      },
      (err) => {
        this.toastr.error(`Falha ao excluir usuário de ID ${userId} !`);
      }
    );
  }

  updateList($event: User) {
    this.listUsers.push($event);
  }
}
