import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  formData = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };
  submitted = false;

  sendMessage() {
    if (this.formData.name && this.formData.message) {
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
        this.formData = { name: '', phone: '', email: '', message: '' };
      }, 4000);
    }
  }
}