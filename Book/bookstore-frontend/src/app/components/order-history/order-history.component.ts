// src/app/components/order-history/order-history.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
// Import the Order model interface - adjust the path if needed
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // Keep if needed for navigation

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule], // CommonModule includes ngIf, ngFor, date pipe, currency pipe
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'] // Link to the CSS file
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  // Use the Order model interface for better type safety
  orders: Order[] = [];
  errorMessage = ''; // To display potential errors from fetching orders
  private ordersSubscription: Subscription | undefined; // Subscription for the orders observable

  constructor(
    private orderService: OrderService,
    private router: Router // Keep if used in the template or other methods
  ) { }

  ngOnInit(): void {
    // Load order history when the component initializes
    this.loadOrderHistory();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  loadOrderHistory(): void {
    this.errorMessage = ''; // Clear previous errors
    this.orders = []; // Clear previous orders

    // Subscribe to the order history service
    this.ordersSubscription = this.orderService.getOrderHistory().subscribe({
      next: (data: Order[]) => { // Cast received data to the Order[] type
        this.orders = data;
        console.log('Order history loaded:', this.orders);
        // You can optionally trigger change detection here if needed,
        // but Angular usually handles this with async operations.
      },
      error: (error) => {
        console.error('Error loading order history:', error);
        this.errorMessage = 'Failed to load order history. Please try again.';
        // Handle specific HTTP error statuses if necessary (e.g., redirect on 401)
        // if (error.status === 401) { this.router.navigate(['/login']); }
      }
    });
  }

  // >>> ADD THIS GETTER METHOD <<<
  // This getter checks if there are any orders loaded, but none of them
  // have any items (meaning they are old orders or failed attempts).
  // It's used to conditionally display the "No completed orders with items found" message.
  get showNoCompletedOrdersMessage(): boolean {
    // If orders haven't loaded yet or are empty, don't show this specific message
    if (!this.orders || this.orders.length === 0) {
       return false;
    }
    // Check if AT LEAST ONE order in the array has order_items
    const hasAnyOrderWithItems = this.orders.some(order => order.order_items && order.order_items.length > 0);

    // Return true (show the message) if there are orders, but none of them have items
    return !hasAnyOrderWithItems;
  }

  // Add other methods if needed (e.g., view book details, cancel order)
  // viewBookDetails(bookId: number): void {
  //   this.router.navigate(['/book', bookId]);
  // }
}