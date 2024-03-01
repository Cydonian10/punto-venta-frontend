import { AuthService } from '@/api/services/auth.service';
import { InputComponent } from '@/components/input/input.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent,ReactiveFormsModule],
  template: `
    <section class="bg-white">
  <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside class="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt="Pattern"
        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div class="max-w-xl lg:max-w-3xl">
        <a class="block text-indigo-600 text-7xl" href="/">
          <span class="sr-only">Home</span>
          <i class='bx bxs-tree-alt'></i>
        </a>

        <h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to Sale of Point 🦑
        </h1>

        <p class="mt-4 leading-relaxed text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
          quibusdam aperiam voluptatum.
        </p>

        <form [formGroup]="loginForm" action="#" class="mt-8 grid grid-cols-6 gap-6">

          <div class="col-span-6">
            <app-input 
              label="Email"
              type="email"
              [control]="loginForm.controls.email"
            />
          </div>

          <div class="col-span-6">
            <app-input 
              label="Password"
              type="password"
              [control]="loginForm.controls.password"
            />
          </div>

          <div class="col-span-6">
            <label for="MarketingAccept" class="flex gap-4">
              <input
                type="checkbox"
                id="MarketingAccept"
                name="marketing_accept"
                class="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
              />

              <span class="text-sm text-gray-700">
                I want to receive emails about events, product updates and company announcements.
              </span>
            </label>
          </div>

          <div class="col-span-6">
            <p class="text-sm text-gray-500">
              By creating an account, you agree to our
              <a href="#" class="text-gray-700 underline"> terms and conditions </a>
              and
              <a href="#" class="text-gray-700 underline">privacy policy</a>.
            </p>
          </div>

          <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              class="flex items-center justify-center gap-2 shrink-0 rounded-md border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition focus:outline-none focus:ring active:text-indigo-500"
              (click)="loginSubmit()"
              type="button"
            >
              <span>Login</span>
            </button>

            <p class="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <a routerLink="/auth/register" class="text-gray-700 underline">Register</a>.
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</section>

  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {

  #formBuider = inject(NonNullableFormBuilder)
  #loginService = inject(AuthService)
  #router = inject(Router)

  public loginForm = this.#formBuider.group({
    email: new FormControl("mabel@hotmail.com", 
      { validators:[Validators.required], nonNullable:true }),
    password: new FormControl("123456.Aaa",
      { validators:[Validators.required,Validators.minLength(6)], nonNullable:true })
  })
  
  public loginSubmit() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const {email,password} = this.loginForm.getRawValue()
    
    this.#loginService.login({email,password}).subscribe( () => {
      this.#router.navigateByUrl("/admin")
    })
  }

}