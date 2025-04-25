import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// ... остальные импорты
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../service/book.service';
import { Book } from '../../models/book.model';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null;
  book: Book | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId = Number(id);
        this.loadBookDetails(this.bookId);
      }
    });
  }

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe({
      next: (response: any) => {
        console.log('Данные от API:', response);
        if (response) {
          this.book = {
            id: response.id,
            title: response.title,
            author: response.author,
            description: response.description,
            price: parseFloat(response.price),
            category: response.category
          };
          console.log('this.book после присвоения:', this.book);
          this.cdr.detectChanges();
        } else {
          this.errorMessage = 'Failed to load book details.';
          this.book = null;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.errorMessage = error;
        this.book = null;
        console.error('Ошибка API:', error);
      }
    });
  }

  addToCart(): void {
    if (this.book) {
      const cartItem: CartItem = {
        book: this.book,
        quantity: 1 // Или другое значение по умолчанию, если нужно
      };
      this.cartService.addToCart(cartItem);
      alert(`'${this.book.title}' has been added to your cart!`);
      console.log('Книга добавлена в корзину:', this.book);
    } else {
      console.warn('Невозможно добавить в корзину: книга не определена.');
      // Можно также показать пользователю сообщение об ошибке
    }
  }
}