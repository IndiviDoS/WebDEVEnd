import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.router.navigate(['/books']); // Redirect on successful login
      },
      error: (error) => {
        let message = 'Invalid username or password. Please try again.';
        if (error.error && error.error.message) {
          message += ' ' + error.error.message;
        }
        alert(message);
      }
    });
  }
}