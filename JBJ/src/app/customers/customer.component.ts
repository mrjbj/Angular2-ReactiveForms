import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

import { Customer } from './customer';

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
            firstName: '',
            lastName: '',
            email: '',
            sendCatalog: true
        });
    }
   populateTestData() {
        this.customerForm.setValue({
            firstName: "Jason",
            lastName: "Jones",
            email: "jason@brucejones.biz",
            sendCatalog: false
        });
    }
   save() {
        console.log(this.customerForm.form);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }
