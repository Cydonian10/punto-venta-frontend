import { AuthRegisterDto } from '@/api/interfaces/auth.interface';
import { AuthService } from '@/api/services/auth.service';
import { ControlComponent } from '@/components/input/control.component';
import { ControlErrorPipe } from '@/core/pipes/control-error.pipe';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    DialogLayout,
    ControlComponent,
    ReactiveFormsModule,
    KeyValuePipe,
    ControlErrorPipe,
  ],
  template: `
    <dialog-layout [title]="data.titulo" (onClose)="closeDialog()">
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="handleSubmit()">
        <div>
          <app-control label="Nombre">
            <input class="input" type="text" formControlName="username" />
            @if (username.invalid && username.touched) {
              @for (error of username.errors | keyvalue; track $index) {
                <span class="text-red-400 text-sm font-bold">{{
                  error | controlError: { minl: 3 }
                }}</span>
              }
            }
          </app-control>
        </div>
        <div>
          <app-control label="Email">
            <input class="input" type="text" formControlName="email" />
            @if (email.invalid && email.touched) {
              @for (error of email.errors | keyvalue; track $index) {
                <span class="text-red-400 text-sm font-bold">{{
                  error | controlError: { minl: 3 }
                }}</span>
              }
            }
          </app-control>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary">Agregar</button>
        </div>
      </form>
    </dialog-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserComponent {
  #authService = Inject(AuthService);

  public form = this.fb.nonNullable.group({
    username: new FormControl('gabriel', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('gabriel@hotmail.com', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get username() {
    return this.form.controls.username;
  }

  get email() {
    return this.form.controls.email;
  }

  constructor(
    private dialogRef: DialogRef<any>,
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: { titulo: string },
  ) {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, username } = this.form.getRawValue();
    const authRegister: AuthRegisterDto = {
      email,
      password: 'xxxxx.AA123',
      name: username,
      salary: 0,
      birthday: new Date(),
      rol: '',
    };

    this.dialogRef.close(authRegister);
  }
}
