import { Rol, UserFull } from '@/api/interfaces/user.interface';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe } from '@angular/common';

interface Roles {
  [key: string]: boolean;
}

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule, JsonPipe],
  template: `
    <form>
      @for (op of opciones; track $index) {
      <div>
        <label>
          <input
            type="checkbox"
            [checked]="selection.isSelected(op)"
            (change)="selection.toggle(op)"
          />
          {{ op }}
        </label>
      </div>
      }

      <button
        (click)="this.onSubmitRole.emit(this.selection.selected)"
        class="btn-ghost ghost ghost-primary py-1.5 mt-4"
        type="button"
      >
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
  public user = input.required<UserFull>();

  selection = new SelectionModel<any>(true, []);

  @Output() onSubmitRole = new EventEmitter();

  opciones = Object.keys(Rol).map((key) => key);

  ngOnInit() {
    this.selection.select(...this.user().roles);
  }
}
