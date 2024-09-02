import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksNewComponent } from './tasks-new.component';

describe('TasksNewComponent', () => {
  let component: TasksNewComponent;
  let fixture: ComponentFixture<TasksNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksNewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
