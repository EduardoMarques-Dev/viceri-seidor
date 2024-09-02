import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './user-list/users-list.component';
import { UsersNewComponent } from './users-new/users-new.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [UsersListComponent, UsersNewComponent],
  imports: [CommonModule, UsersRoutingModule, ReactiveFormsModule],
  exports: [UsersNewComponent], // Certifique-se que está exportando
})
export class UsersModule {}
