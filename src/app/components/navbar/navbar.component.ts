import { LayoutService } from '@/core/services/layout.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

  #layoutService = inject(LayoutService)

  public toogle() {
    this.#layoutService.toogle()
  }

}
