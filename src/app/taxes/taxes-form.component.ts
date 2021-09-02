import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'taxes-form',
  template: `
    <form [formGroup]="form">

      <select [formControlName]="'contract'">
        <option *ngFor="let contractType of contractTypes"
                [value]="contractType"
        >{{contractType}}</option>
      </select>

      <label *ngIf="isContract('B2B')">
        <input [formControlName]="'newOrder'"
               type="checkbox">
        New Order
      </label>

      <label>
        Employee gross
        <input [formControlName]="'employeeGross'" type="number">
      </label>

    </form>

    <div>
      Net: {{grossAfterTax}}
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxesFormComponent implements OnInit {

  private static readonly LOWER_TAX = 1.17;
  private static readonly HIGHER_TAX = 1.32;
  private static readonly B2B_TAX = 1.19;

  form: FormGroup;

  grossAfterTax: string = '0.00';

  contractTypes = ['UoP', 'B2B'];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      newOrder: [],
      contract: [this.contractTypes[0], Validators.required],
      employeeGross: ['', Validators.required]
    });
  }

  ngOnInit() {
    combineLatest([
      this.form.controls['employeeGross'].valueChanges,
      this.form.controls['contract'].valueChanges.pipe(startWith(this.contractTypes[0])),
      this.form.controls['newOrder'].valueChanges.pipe(startWith(false))
    ])
      .pipe(
        map(([gross, contract, newOrder]: [number, string, boolean]) => {
          return this.getGrossAfterTaxBasedOnContract(gross, contract);
        })
      )
      .subscribe((grossAfterTax: number) => {
        this.grossAfterTax = this.getResult(grossAfterTax);
        this.changeDetectorRef.detectChanges();
      });
  }

  getResult(grossAfterTax: number): string {
    return grossAfterTax.toFixed(2);
  }

  getGrossAfterTaxBasedOnContract(gross: number, contractType: string): number {
    switch (true) {

      case contractType === 'UoP': {
        return gross > 7000
          ? this.getGrossAfterTax(gross, TaxesFormComponent.HIGHER_TAX)
          : this.getGrossAfterTax(gross, TaxesFormComponent.LOWER_TAX);
      }

      case contractType === 'B2B': {
        const grossAfterTax = this.getGrossAfterTax(gross, TaxesFormComponent.B2B_TAX);
        return this.isContract('B2B') && this.form.controls['newOrder'].value === true
          ? grossAfterTax * 1.09
          : grossAfterTax;
      }

      default: {
        return 0;
      }
    }
  }

  getGrossAfterTax(gross: number, tax: number): number {
    return gross / tax;
  }

  isContract(contractType: string): boolean {
    return contractType === this.form.controls['contract'].value;
  }
}

