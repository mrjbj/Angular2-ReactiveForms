import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray} from '@angular/forms';

import { Customer } from './customer';
import 'rxjs/add/operator/debounceTime';


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
    selector: ' my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    customer: Customer= new Customer();
    emailValidationMessage: string; 

    get addresses() : FormArray {
        return <FormArray>this.customerForm.get('addresses');
    }
    private validationMessages = {
        required: 'Please enter your email address.', 
        pattern: 'Please enter a valid email address.'
    };

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
            rating: ['', ratingRange(1, 5)],
            sendCatalog: true,
            addresses: this._builder.array([this.buildAddress()])
            })
        this.customerForm.get('notification').valueChanges
                         .subscribe(value => this.setNotification(value));
        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1000).subscribe( value => this.setMessage(emailControl));
    }

    addAddress() : void {
        this.addresses.push(this.buildAddress());
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

   buildAddress() : FormGroup {
        return this._builder.group({
                addressType: 'home',
                street1:    '',
                street2:    '',
                city:       '',
                state:      '',
                zip:        ''
        });
    }
    setMessage(c: AbstractControl): void {
        this.emailValidationMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailValidationMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
        }
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