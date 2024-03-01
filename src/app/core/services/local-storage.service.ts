import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  save<T>(list:T,key:string) {
    let data = JSON.stringify(list)
    localStorage.setItem(key,data)
  }

  get<T>(key:string) : T | null {
    const objectString = localStorage.getItem(key)
    if(objectString) {
      let data:T = JSON.parse(objectString)
      return data
    }
    return null
  } 

  remove(key:string) {
    localStorage.removeItem(key)
  }
}
