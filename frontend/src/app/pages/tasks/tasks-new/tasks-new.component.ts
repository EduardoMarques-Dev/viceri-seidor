import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../shared/task.model';
import { TasksService } from '../shared/tasks.service';

@Component({
  selector: 'app-tasks-new',
  templateUrl: './tasks-new.component.html',
  styleUrls: ['./tasks-new.component.css'],
})
export class TasksNewComponent implements OnInit {
  public formTask: FormGroup;

  @Output() newTask: EventEmitter<Task> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private toastr: ToastrService
  ) {
    this.formTask = this.buildFormTask();
  }

  ngOnInit(): void {}

  private buildFormTask(): FormGroup {
    return this.fb.group({
      description: [null, [Validators.required, Validators.minLength(4)]],
      priority: [null, [Validators.required]],
    });
  }

  public isFormControlInvalid(controlName: string): boolean {
    const control = this.formTask.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  public saveNewTask(): void {
    // Realiza a transformação da prioridade antes de enviar
    const transformedTask: Task = {
      ...this.formTask.value,
      priority: this.transformPriority(this.formTask.value.priority),
    };

    this.tasksService.saveNew(transformedTask).subscribe(
      (res) => {
        this.toastr.success('Nova tarefa salva com sucesso!');
        this.formTask.reset();
        this.newTask.emit(res);
      },
      (err) => {
        console.log(err);
        this.toastr.error('Falha ao salvar nova tarefa');
      }
    );

    console.log(this.formTask.value);
  }

  private transformPriority(priority: string): string {
    switch (priority) {
      case 'Alta':
        return 'HIGH';
      case 'Media':
        return 'MEDIUM';
      case 'Baixa':
        return 'LOW';
      default:
        return priority;
    }
  }
}
