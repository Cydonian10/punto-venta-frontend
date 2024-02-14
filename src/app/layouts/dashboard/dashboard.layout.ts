import { AlertComponent } from '@/components/alert/alert.component';
import { NavbarComponent } from '@/components/navbar/navbar.component';
import { SideMenuComponent } from '@/components/side-menu/side-menu.component';
import { AlertService } from '@/core/services/alert.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SideMenuComponent, NavbarComponent,AlertComponent],
  templateUrl:"./dashboard.layout.html", 
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayout {

  public config = inject(AlertService).config

}