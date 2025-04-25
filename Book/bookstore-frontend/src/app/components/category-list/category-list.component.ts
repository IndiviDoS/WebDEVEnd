//ХОТЕЛА ЧТОБЫ ДЛЯ КАТЕГОРИЙ БЫЛО ОТДЕЛЬНОЕ ОКНО 
//И ТАМ МОЖНО БЫЛО БЫ СОРТИРОВАТЬ КНИГИ ПО КАТЕГОРИИ


import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../service/category.service';
import { CommonModule } from '@angular/common'; // Импортируйте CommonModule
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Добавьте CommonModule
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  errorMessage = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => this.errorMessage = error
    });
  }
}