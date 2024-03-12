import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'controlError',
  standalone: true,
})
export class ControlErrorPipe implements PipeTransform {
  transform(
    value: KeyValue<string, any>,
    val?: { minl?: number; regex?: string }
  ): string {
    const errorMessages: Record<string, string> = {
      required: 'The field es required',
      email: 'The email es invalid',
      minlength: `Requried ${val?.minl} characters minimo`,
    };

    return errorMessages[value.key];
  }
}
