import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://127.0.0.1:8000/api/books/'; // URL вашего Django API для книг

  constructor(private http: HttpClient) { }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}${id}/`);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Omit<Book, 'id' | 'category'> & { category_id: number }): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Omit<Book, 'category'> & { category_id?: number }): Observable<Book> {
    return this.http.put<Book>(`<span class="math-inline">\{this\.apiUrl\}</span>{id}/`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`<span class="math-inline">\{this\.apiUrl\}</span>{id}/`);
  }
}