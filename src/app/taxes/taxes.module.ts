import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaxesFormComponent } from './taxes-form.component';
import { TaxesComponent } from './taxes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TaxesComponent,
    TaxesFormComponent
  ],
  exports: [
    TaxesComponent
  ]
})
export class TaxesModule {

}
