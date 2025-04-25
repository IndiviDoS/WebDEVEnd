export interface Book {
    id: number;
    category: Category; // Объект Category
    title: string;
    author: string;
    price: number; // Или number, если вы хотите обрабатывать как число
    description: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }