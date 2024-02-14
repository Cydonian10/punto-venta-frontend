import { Injectable, computed, signal } from '@angular/core';
import {Breakpoints,BreakpointObserver} from "@angular/cdk/layout"

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  #open = signal(false);
  public open = computed(() => this.#open());

  private displayNameMap = new Map([

    [Breakpoints.XSmall,'XSmall'],
    [Breakpoints.Small,'Small'],
    [Breakpoints.Medium,'Medium'],
    [Breakpoints.Large,'Large'],
    [Breakpoints.XLarge,'XLarge'],

  ]);

  constructor(breakpointObserver:BreakpointObserver){
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
        
    ]).subscribe(result => {

      for( const query of Object.keys(result.breakpoints) ) {
        if( result.breakpoints[query]) { 
          const breakpoint = this.displayNameMap.get(query);

          switch(breakpoint) {
            case "XSmall":
              this.#open.set(false)
              break;
            case "Small":
              this.#open.set(false)
              break;
            default:
              this.#open.set(true)
              break
          }
        }
      } 

    });
  }

  toogle() {
    this.#open.update(value => !value)
  }

}
