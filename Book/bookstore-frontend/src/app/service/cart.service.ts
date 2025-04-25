import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Book } from '../models/book.model'; // Добавьте, если нужно для addToCart

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<CartItem[]>(this.getCartItemsFromStorage());
  cart$ = this.cartItemsSource.asObservable();
  private apiUrl = 'http://127.0.0.1:8000/api/orders/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getCartItemsFromStorage(): CartItem[] {
    const items = localStorage.getItem('cart');
    return items ? JSON.parse(items) : [];
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSource.getValue()));
  }

  addToCart(itemToAdd: CartItem): void {
    const currentItems = this.cartItemsSource.getValue();
    const existingItemIndex = currentItems.findIndex(i => i.book.id === itemToAdd.book.id);

    let updatedItems;

    if (existingItemIndex > -1) {
      updatedItems = currentItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + itemToAdd.quantity };
        }
        return item;
      });
    } else {
      updatedItems = [...currentItems, itemToAdd];
    }

    this.cartItemsSource.next(updatedItems);
    this.saveCartToLocalStorage();
  }


  removeFromCart(bookId: number): void {
    const currentItems = this.cartItemsSource.getValue();
    const itemIndex = currentItems.findIndex(item => item.book.id === bookId);

    if (itemIndex > -1) {
      const itemToUpdate = currentItems[itemIndex];
      let updatedItems;

      if (itemToUpdate.quantity > 1) {
        updatedItems = currentItems.map((item, index) => {
          if (index === itemIndex) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
      } else {
        updatedItems = currentItems.filter((item, index) => index !== itemIndex);
      }
      this.cartItemsSource.next(updatedItems);
      this.saveCartToLocalStorage();
    }
  }

  clearCart(): void {
    this.cartItemsSource.next([]);
    localStorage.removeItem('cart');
  }

  // In CartService.ts - placeOrder method
  placeOrder(orderItems: { book_id: number; quantity: number }[]): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
        console.error('No token found for placing order');
        return of({ error: true, message: 'Authentication required.'});
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // THIS IS THE ACTUAL REQUEST THAT IS SENT
    return this.http.post<any>(this.apiUrl, { items: orderItems }, { headers: headers });

    // >>>>>> THESE LINES ARE UNREACHABLE AND SHOULD BE REMOVED OR COMMENTED OUT <<<<<<
    // console.log('Попытка размещения заказа:', { items: orderItems }, 'Токен:', token);
    // return new Observable(subscriber => {
    //   console.log('Заказ успешно эмулирован (не отправлен на бэкенд).');
    //   subscriber.next({ message: 'Order placed successfully (emulated).' });
    //   subscriber.complete();
    // });
  }
}