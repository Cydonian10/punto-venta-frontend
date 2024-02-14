import { NavbarComponent } from '@/components/navbar/navbar.component';
import { SideMenuComponent } from '@/components/side-menu/side-menu.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SideMenuComponent, NavbarComponent],
  templateUrl:"./dashboard.layout.html", 
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayout {}