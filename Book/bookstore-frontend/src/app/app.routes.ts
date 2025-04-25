import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { HomepageComponent } from './components/homepage/homepage.component'; // Убедитесь, что импортирован HomeComponent

export const routes: Routes = [ // Экспортируем константу routes
  { path: '', component: HomepageComponent, pathMatch: 'full' }, // Добавлен маршрут для Home
  { path: 'home', redirectTo: '', pathMatch: 'full' },     // Опционально: редирект на '/'
  { path: 'books', component: BookListComponent },
  { path: 'orders', component: OrderListComponent }, // Оставьте этот маршрут для корзины
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book/:id', component: BookDetailsComponent },
];

// Если вы используете NgModule (app-routing.module.ts):
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }