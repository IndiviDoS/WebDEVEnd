import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials = { username: '', email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    this.errorMessage = '';
    this.authService.register(this.credentials).subscribe({
      next: (response) => {
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        let message = 'Registration failed. Please check your details.';
        if (error.error && error.error.message) {
          message += ' ' + error.error.message;
        }
        alert(message);
      }
    });
  }
}