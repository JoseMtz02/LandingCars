import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      condiciones: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.http.post('http://localhost:3000/api/contact', this.contactForm.value)
        .subscribe({
          next: () => {
            this.message = '¡Gracias! Pronto te contactaremos.';
            this.contactForm.reset();
          },
          error: (err) => {
            console.error('Error:', err);
            this.message = 'Error al enviar los datos. Por favor intenta de nuevo.';
          }
        });
    }
  }
 
}
