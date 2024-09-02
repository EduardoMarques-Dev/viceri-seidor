import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../pages/users/shared/user.model';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: Router,
    private toast: ToastrService
  ) {
    this.formLogin = this.createFormLogin();
  }

  ngOnInit(): void {}

  public createFormLogin(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public isFormControlInvalid(controlName: string): boolean {
    return !!(
      this.formLogin.get(controlName)?.invalid &&
      this.formLogin.get(controlName)?.touched
    );
  }

  public submitForm() {
    const { email, password } = this.formLogin.value;
    this.formLogin.reset;

    this.loginService.login(email, password).subscribe(
      (res) => {
        this.toast.success('Login efetuado com sucesso');
        this.route.navigate(['']);
      },
      (err) => {
        this.toast.error(err);
      }
    );
  }

  public onUserCreated(newUser: User): void {
    this.toast.success(`Usuário ${newUser.name} criado com sucesso!`);
    // Adicione aqui qualquer ação adicional que você queira realizar após a criação do usuário
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
