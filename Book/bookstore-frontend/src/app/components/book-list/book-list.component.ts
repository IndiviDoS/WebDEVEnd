import { Component, OnInit } from '@angular/core';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-list', 
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.errorMessage = ''; // Сбрасываем ошибку перед загрузкой
    this.books = [];        // Очищаем книги перед загрузкой

    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        console.log('Книги успешно загружены:', books); // Сообщение в консоль браузера
      },
      error: (error: HttpErrorResponse) => { // Указываем тип ошибки
        console.error('Ошибка при загрузке книг:', error); // Выводим полную ошибку в консоль браузера
        // Формируем более понятное сообщение для пользователя
        if (error.status === 0) {
          this.errorMessage = 'Не удалось подключиться к серверу API. Проверьте, запущен ли он и настройки CORS.';
        } else {
          this.errorMessage = `Ошибка сервера: ${error.status} - ${error.message}. Подробности в консоли.`;
        }
      }
    });
  }

  viewBookDetails(id: number): void {
    this.router.navigate(['/book', id]);
  }
}