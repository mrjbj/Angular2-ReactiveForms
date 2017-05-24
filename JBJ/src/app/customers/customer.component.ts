import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import { Customer } from './customer';


function ratingRange(min: number, max: number) : ValidatorFn {
    return  (c: AbstractControl): {[key: string]: boolean } | null => 
    {
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return {'range': true};
        }
        return null;
    }
};
function emailMatcher(c: AbstractControl) {
    let email = c.get('email');
    let confirm = c.get('confirmEmail');
    if (email.pristine || confirm.pristine) {
        return null;
    }
    if (email.value === confirm.value) {
        return null; 
    }
    return {'match': true};
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    customer: Customer= new Customer();

    constructor(private _builder: FormBuilder) {};

    ngOnInit(): void {
        this.customerForm = this._builder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            emailGroup: this._builder.group({
                email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+")]],
                confirmEmail: ['', Validators.required]
            } , {validator: emailMatcher}),
            notification: 'email',
            phone: '',
            rating: ['', ratingRange(0, 7)],
            sendCatalog: true
        });
    }
   populateTestData() {
        this.customerForm.patchValue({
            firstName: "Jason",
            lastName: "Jones",
            email: "jason@brucejones.biz",
            sendCatalog: false
        });
    }
   save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
    setNotification(notifyVia: string): void {
       const phoneControl = this.customerForm.get('phone');
       if (notifyVia === 'text') {
           phoneControl.setValidators(Validators.required);
       } else {
           phoneControl.clearValidators();
       }
       phoneControl.updateValueAndValidity();
    }
 }