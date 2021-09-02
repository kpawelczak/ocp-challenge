import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'taxes-form',
  template: `
    <form [formGroup]="form">

      <label>
        Employee gross
        <input [formControlName]="'employeeGross'" type="number">
      </label>

    </form>

    <div>
      Gross: {{getResult()}}
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxesFormComponent implements OnInit {

  private static readonly LOWER_TAX = 0.17;
  private static readonly HIGHER_TAX = 0.32;

  form: FormGroup;

  grossAfterTax: number = 0;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      employeeGross: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form.controls['employeeGross']
      .valueChanges
      .pipe(
        filter(gross => gross),
        map((gross: number) => {
          return gross > 7000
            ? this.getGrossAfterTax(gross, TaxesFormComponent.HIGHER_TAX)
            : this.getGrossAfterTax(gross, TaxesFormComponent.LOWER_TAX);
        })
      )
      .subscribe((grossAfterTax: number) => {
        this.grossAfterTax = grossAfterTax;
        this.changeDetectorRef.detectChanges();
      });
  }

  getResult(): string {
    return this.grossAfterTax.toFixed(2);
  }

  getGrossAfterTax(gross: number, tax: number): number {
    return gross * (1 - tax);
  }

}

