import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public listAll(): Observable<User[]> {
    const url = `${environment.baseUrlBackend}/user`;

    return this.http.get(url).pipe(map(this.mapToUsers));
  }

  public listById(id: number): Observable<User> {
    const url = `${environment.baseUrlBackend}/user/${id}`;

    return this.http.get(url).pipe(map(this.mapToUser));
  }

  public saveNew(newUser: User): Observable<User> {
    const url = `${environment.baseUrlBackend}/user`;

    return this.http.post(url, newUser).pipe(map(this.mapToUser));
  }

  public update(user: User): Observable<User> {
    const url = `${environment.baseUrlBackend}/user/${user.id}`;

    return this.http.put(url, user).pipe(map(this.mapToUser));
  }

  public delete(userId: number): Observable<any> {
    const url = `${environment.baseUrlBackend}/user/${userId}`;
    return this.http.delete(url, { responseType: 'json' });
  }

  private mapToUsers(data: any): Array<User> {
    const listUsers: User[] = [];

    data.forEach((e: any) => listUsers.push(Object.assign(new User(), e)));

    return listUsers;
  }

  private mapToUser(data: any): User {
    return Object.assign(new User(), data);
  }
}
