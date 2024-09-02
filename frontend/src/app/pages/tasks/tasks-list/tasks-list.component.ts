import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../shared/task.model';
import { TasksService } from '../shared/tasks.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css'],
})
export class TasksListComponent implements OnInit {
  public listTasks: Array<Task> = [];

  constructor(
    private taskService: TasksService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.taskService.listAll().subscribe((res) => {
      this.listTasks = res;
    });
  }

  public removerTask(taskId: any) {
    if (!window.confirm(`Deseja excluir a tarefa de id: ${taskId} ?`)) {
      return;
    }

    this.taskService.delete(taskId).subscribe(
      (res) => {
        this.toastr.success(`Tarefa de ID ${taskId} excluída com sucesso!`);
        this.listTasks = this.listTasks.filter((e) => e.id !== taskId);
      },
      (err) => {
        this.toastr.error(`Falha ao excluir tarefa de ID ${taskId}!`);
      }
    );
  }

  public updateToCompleted(task: any) {
    if (!window.confirm(`Deseja concluir a tarefa de id: ${task.id} ?`)) {
      return;
    }

    this.taskService.updateToCompleted(task).subscribe(
      (res) => {
        this.toastr.success(`Tarefa de ID ${task.id} concluída com sucesso!`);
        this.listTasks = this.listTasks.filter((e) => e.id !== task.id);
      },
      (err) => {
        this.toastr.error(`Falha ao concluir tarefa de ID ${task.id} !`);
      }
    );
  }

  updateList($event: Task) {
    this.listTasks.push($event);
  }
}
