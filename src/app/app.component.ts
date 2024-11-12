import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  phoneForm: FormGroup = this.fb.group({
    fname: ['anusha', [Validators.required]], // Pre-fill first name
    lname: ['babu', [Validators.required]],   // Pre-fill last name
    email: ['anu@gmail.com', [Validators.required, Validators.email]], // Pre-fill email
    phone: ['6238931419', [Validators.required]] // Pre-fill phone number
  });

  @ViewChild('phoneInput', { static: true }) phoneInput!: ElementRef;
  private iti: any; // Use 'any' for the intl-tel-input instance

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize intl-tel-input
    const input = this.phoneInput.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: 'in', // Set initial country to India (matching the country code 91)
      utilsScript: 'assets/utils.js' // Path to the utils script
    });

    // Set the initial phone value with the country code
    this.phoneForm.patchValue({
      phone: `+${this.iti.getSelectedCountryData().dialCode} ${this.phoneForm.get('phone')?.value}`
    });

    // Listen for changes and update the phone number with the country code
    input.addEventListener('countrychange', () => {
      const countryData = this.iti.getSelectedCountryData();
      const currentPhone = this.phoneForm.get('phone')?.value.replace(/^\+\d+\s*/, ''); // Remove any existing country code
      this.phoneForm.patchValue({
        phone: `+${countryData.dialCode} ${currentPhone}`
      });
    });
  }

  onSubmit(): void {
    if (this.phoneForm.valid) {
      console.log('Form Values:', this.phoneForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
