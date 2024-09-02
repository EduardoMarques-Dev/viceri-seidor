import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  public listAll(): Observable<Task[]> {
    const url = `${environment.baseUrlBackend}/task/pendent`;

    return this.http.get(url).pipe(map(this.mapToTasks));
  }

  public listById(id: number): Observable<Task> {
    const url = `${environment.baseUrlBackend}/task/${id}`;

    return this.http.get(url).pipe(map(this.mapToTask));
  }

  public saveNew(newTask: Task): Observable<Task> {
    const url = `${environment.baseUrlBackend}/task`;

    return this.http.post(url, newTask).pipe(map(this.mapToTask));
  }

  public update(task: Task): Observable<Task> {
    const url = `${environment.baseUrlBackend}/task/${task.id}`;

    return this.http.put(url, task).pipe(map(this.mapToTask));
  }

  public updateToCompleted(task: Task): Observable<Task> {
    const url = `${environment.baseUrlBackend}/task/${task.id}`;

    const requestBody = { status: 'COMPLETED' };

    return this.http.patch(url, requestBody).pipe(map(this.mapToTask));
  }

  public delete(taskId: number): Observable<any> {
    const url = `${environment.baseUrlBackend}/task/${taskId}`;
    return this.http.delete(url, { responseType: 'json' });
  }

  private mapToTasks(data: any): Array<Task> {
    const listTasks: Task[] = [];

    data.forEach((e: any) => listTasks.push(Object.assign(new Task(), e)));

    return listTasks;
  }

  private mapToTask(data: any): Task {
    return Object.assign(new Task(), data);
  }
}
