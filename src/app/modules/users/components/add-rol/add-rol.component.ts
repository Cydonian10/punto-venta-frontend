import { Rol } from '@/api/interfaces/user.interface';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Input } from '@angular/core';

interface Roles {
  [key: string]: boolean;
}

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="hanldeSubmit()">
      @for (op of opciones; track $index) {
      <div>
        <label>
          <input type="checkbox" [formControlName]="op.value" />
          {{ op.label }}
        </label>
      </div>
      }
      <button class="btn-ghost ghost ghost-primary py-1.5 mt-4" type="submit">
        Enviar
      </button>
    </form>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRolComponent {
  #fb = inject(FormBuilder);
  @Input() email: string = '';

  roles = input.required<string[]>();

  @Output() onSubmitRole = new EventEmitter();

  public form = this.#fb.group({});

  opciones = Object.keys(Rol).map((key) => ({
    label: key,
    value: Rol[key as keyof typeof Rol],
  }));

  constructor() {
    this.opciones.forEach((op) => {
      this.form.addControl(op.value, new FormControl(false));
    });

    effect(() => {
      this.roles().forEach((role: any) => {
        if (this.form.get(role)) {
          this.form.get(role)!.patchValue(true);
        }
      });
    });
  }

  hanldeSubmit() {
    const roles = this.form.getRawValue() as Roles;

    const keysWithTrueValues = Object.keys(roles).filter((key) => roles[key]);

    this.onSubmitRole.emit({ email: this.email, roles: keysWithTrueValues });
  }
}
