import { User } from '@/api/interfaces/auth.interface';
import { AuthService } from '@/api/services/auth.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

@Component({
  selector: 'company-info',
  standalone: true,
  imports: [TitleCasePipe, DatePipe],
  template: `
    @if (cliente) {
      <div class="space-y-1 hidden print:block">
        <h3>Empresa: Servicios Generales Jauja</h3>
        <p>RUC: 123123123213123</p>
        <p>Direccion: AV. Ricardo Palma 629</p>
        <p>Fecha: {{ date | date: 'yyyy-MM-dd' }}</p>
      </div>
      <p class="font-bold mt-1">Cliente: {{ cliente.name | titlecase }}</p>
    }

    <ng-content></ng-content>

    @if (cliente) {
      <p class="hidden print:block">Vendedor: {{ user()?.usuario?.name }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyInfoComponent {
  public user = inject(AuthService).user;

  @Input() cliente: User | null = null;

  public date = new Date();

  ngOnInit() {
    console.log(this.user());
  }
}
