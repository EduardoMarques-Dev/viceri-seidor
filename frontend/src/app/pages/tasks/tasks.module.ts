import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksNewComponent } from './tasks-new/tasks-new.component';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
  declarations: [TasksListComponent, TasksNewComponent],
  imports: [CommonModule, TasksRoutingModule, ReactiveFormsModule],
  exports: [TasksNewComponent], // Certifique-se que está exportando
})
export class TasksModule {}
