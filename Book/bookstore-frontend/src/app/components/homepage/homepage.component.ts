import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  projectInfo = 'Welcome to our comprehensive online bookstore! We offer a vast selection of books spanning various genres, catering to every reader\'s taste. Our platform is designed to provide a seamless and enjoyable book discovery and purchasing experience.';
  creatorsInfo = 'Meet the dedicated individuals who brought this project to life:';
  creators = [
    {
      name: 'Yerdaulet Makhambet',
      contribution: 'Led the full-stack development of this bookstore, architecting both the user-friendly front-end interface and the robust back-end system. Yerdaulet was responsible for the overall design, implementation, and integration of all features, ensuring a cohesive and functional platform.'
    },
    {
      name: 'Bolat Zhakanov',
      contribution: 'Focused on the crucial back-end development of the bookstore. Bolat played a key role in building the server-side logic, database management, and API endpoints that power the application, ensuring its stability and efficiency.'
    },
    {
      name: 'Zhanasyl Rysbek',
      contribution: 'Contributed to the front-end development of the bookstore. Zhanasyl was responsible for designing the our user interface and its creating, enhancing user experience through thoughtful design and implementation of interactive elements.'
    }
  ];
  websiteFeatures = [
    'Browse and search through an extensive catalog of books.',
    'View detailed information about each book, including descriptions and reviews.',
    'Easily add books to your shopping cart and manage your selections.',
    'Secure user registration and login for a personalized experience.',
    'A streamlined checkout process for hassle-free purchases.',
    'Responsive design ensuring a great experience on all devices.'
  ];
}