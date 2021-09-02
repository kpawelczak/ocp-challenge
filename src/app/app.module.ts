import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TaxesModule } from './taxes/taxes.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TaxesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
