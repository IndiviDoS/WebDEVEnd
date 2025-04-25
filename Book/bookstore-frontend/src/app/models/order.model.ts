// src/app/models/order.model.ts

// Import the Book interface, as OrderItem contains a nested Book
import { Book } from './book.model';

// >>> Define the OrderItem interface <<<
// This interface represents a single item within an order,
// matching the structure sent by your backend's OrderItemSerializer.
export interface OrderItem {
  id: number; // The ID of the OrderItem record itself
  book: Book; // The nested Book object containing details (id, title, author, etc.)
  quantity: number; // The quantity of this book in this specific order item
  // If your backend's OrderItemSerializer includes book_id, you might add it here too:
  // book_id?: number;
}

// >>> Update the Order interface <<<
// This interface represents an entire order,
// matching the structure sent by your backend's OrderSerializer.
export interface Order {
  id: number;
  user: string; // Username (as sent by ReadOnlyField)
  order_date: string; // Date and time of the order
  total_price: number; // Total price of the order
  // >>> Replace the old 'books' property with the new 'order_items' property <<<
  order_items: OrderItem[]; // Array of OrderItem objects included in this order
  // Add any other top-level properties your backend's OrderSerializer includes
  // e.g., status?: string;
}

// Note: Ensure your book.model.ts and category.model.ts files are correct and accessible
// for the Book interface definition.