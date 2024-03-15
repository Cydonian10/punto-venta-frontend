import { ProductService } from '@/api/services/product.service';
import { ControlComponent } from '@/components/input/control.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    ControlComponent,
    TitleCreateComponent,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  template: `
    <app-title-create title="Generador de codigo QR"></app-title-create>

    <form
      [formGroup]="form"
      (ngSubmit)="handleSubmit()"
      class="p-10 rounded-xl bg-white mb-10 space-y-5"
    >
      <!-- *************************************** -->
      <!-- ******** Nombre Producto ************* -->
      <!-- *************************************** -->
      <div>
        <app-control label="Nombre Producto">
          <input
            type="text"
            placeholder="nombre"
            class="input"
            formControlName="nombre"
          />
        </app-control>
      </div>

      <!-- *************************************** -->
      <!-- ******** Codigo QR ******************** -->
      <!-- *************************************** -->
      <div>
        <app-control label="Codigo QR">
          <input
            type="text"
            placeholder="codigo qr"
            class="input"
            formControlName="codigoqr"
          />
        </app-control>
      </div>

      <button class="btn btn-primary">Genear QR</button>
    </form>

    <div class="grid grid-cols-7">
      @for (item of listQr(); track $index) {
        <div
          class="flex flex-col bg-gray-100 p-5 rounded-lg justify-center items-center"
        >
          <h3 class="text-center font-semibold">
            {{ item.nombre | titlecase }}
          </h3>
          <img [src]="item.codigoqr" width="100" height="100" alt="" />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class QrCodePage {
  #productService = inject(ProductService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    codigoqr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public qrCodeImage = signal<string>('');
  public listQr = signal<{ nombre: string; codigoqr: string }[]>([]);
  // public listQrImage = signal<{ nombre: string; codigoqr: string }[]>([]);

  // listQury = effect(() => {
  //   this.listQr().map((resp) =>
  //     this.#productService.generateQrCode(resp.codigoqr).subscribe((x) => {
  //       this.qrCodeImage.set(x);
  //     }),
  //   );
  // });

  ngOnInit() {}

  handleSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.#productService
      .generateQrCode(this.form.getRawValue().codigoqr)
      .subscribe((resp) => {
        const data = { nombre: this.form.getRawValue().nombre, codigoqr: resp };
        this.listQr.update((val) => [...val, data]);
      });

    console.log(this.form.getRawValue());
  }
}
