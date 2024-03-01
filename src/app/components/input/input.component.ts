import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './input.component.html',
  styles: `
    :host {
      display:block;
      width:100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() control = new FormControl();
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

  public errorMessages: Record<string, string> = {
    required: 'The field es required',
    email: 'The email es invalid',
    minlength: 'Requried 6 characters minimo',
  };
}
