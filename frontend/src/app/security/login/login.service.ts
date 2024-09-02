import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    const url = `${environment.baseUrlBackend}/login`;

    console.log({ username: email, password });

    let requestBody = { email: email, password: password };

    return this.httpClient
      .post(url, requestBody, { responseType: 'json' })
      .pipe(
        map((data) => this.setTokenLocalStorage(data)),
        catchError((err) => {
          this.removerTokenLocalStorage();
          throw `Falha ao efetuar o login`;
        })
      );
  }

  public getToken(): string | null {
    return localStorage.getItem(environment.token);
  }

  private setTokenLocalStorage(response: any): void {
    const { type, access_token, _ } = response;
    localStorage.setItem(environment.token, access_token);
  }

  private removerTokenLocalStorage(): void {
    localStorage.removeItem(environment.token);
  }
}
