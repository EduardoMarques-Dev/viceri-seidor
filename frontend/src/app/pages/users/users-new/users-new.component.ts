import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])(?!.*\s).{4,20}$/;
    const valid = regex.test(control.value);
    return valid ? null : { passwordInvalid: true };
  };
}

export function emailValidator(): ValidatorFn {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex similar ao usado pelo class-validator
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = emailRegex.test(control.value);
    return valid ? null : { emailInvalid: true };
  };
}

@Component({
  selector: 'app-users-new',
  templateUrl: './users-new.component.html',
  styleUrls: ['./users-new.component.css'],
})
export class UsersNewComponent implements OnInit {
  public formUser: FormGroup;

  @Output() newUser: EventEmitter<User> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.formUser = this.buildFormUser();
  }

  ngOnInit(): void {}

  private buildFormUser(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, emailValidator()]],
      password: [null, [Validators.required, passwordValidator()]],
    });
  }

  public isFormControlInvalid(controlName: string): boolean {
    return !!(
      this.formUser.get(controlName)?.invalid &&
      this.formUser.get(controlName)?.touched
    );
  }

  public saveNewUser(): void {
    const newUser: User = this.formUser.value as User;

    this.usersService.saveNew(newUser).subscribe(
      (res) => {
        this.toastr.success('Novo usuário salvo com sucesso!');
        this.formUser.reset();
        this.newUser.emit(res);
      },
      (err) => {
        console.log(err);
        this.toastr.error('Falha ao salvar novo usuário');
      }
    );

    console.log(this.formUser.value);
  }
}
