import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  config = signal<any>({
    color:"bg-green-500",
    message:"xxxxx",
    type:"error",
    show:false,
  })

  setId:any

  showAlertSuccess(message:string) {

    this.config.update(old => {
      return { ...old,show:false }
    })


    setTimeout(() => {

    clearTimeout(this.setId)

      this.config.set({
        color:"bg-green-500",
        message,
        type:"Success",
        show:true
      }) 

      this.setId = setTimeout(() => {
        this.config.update(old => {
          return { ...old,show:false }
        })
      },3000) 
    },1)
    
  }

  showAlertError(message:string) {
    
    this.config.update(old => {
      return { ...old,show:false }
    })

    setTimeout(() => {
      clearTimeout(this.setId)
    
      this.config.set({
        color:"bg-slate-700",
        message,
        type:"Error",
        show:true
      }) 

      this.setId =  setTimeout(() => {
        this.config.update(old => {
          return { ...old,show:false }
        })
      },3000) 
    }, 1);
  }

}