# WebDEVEnd
Online Bookstore

This is a web application project for Browse and purchasing books online. The backend is built with Django REST Framework, and the frontend is developed using Angular.
Key Features

    Browse Book Catalog: Users can view the list of available books.
    View Book Details: Display detailed information about each book (title, author, price, etc.).
    User Authentication: User registration and login functionality using JWT (JSON Web Tokens) via djangorestframework-simplejwt.
    Shopping Cart: Users can add books to and manage their shopping cart.
    Order Placement: Users can place orders for the books in their cart.
    Order History: Authenticated users can view their past orders.
    Django Admin Panel: Superusers can manage application data (books, users, orders) through the standard Django admin interface.

Technologies Used

    Backend:
        Python
        Django
        Django REST Framework (rest_framework)
        Django Simple JWT (rest_framework_simplejwt) - for authentication
        Django CORS Headers (corsheaders) - for Frontend-Backend communication
        Database (SQLite default)
    Frontend:
        TypeScript
        Angular
        HTML
        CSS
    General:
        Git / GitHub
        Python Virtual Environment (venv)

Development Team

    Makhambet Yerdaulet
    Rysbek Zhanasyl
    Zhakanov Bolat

Setup and Run
Prerequisites

    Python 3.x
    Node.js and npm (or yarn)
    Git

Backend (Django)
Clone the repository:

git clone [https://github.com/Asylzhann/Web-Dev-Project]
cd [project]/[bookstore]

Create and activate a virtual environment:

python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Apply migrations:

python manage.py migrate

Create a superuser (for admin access):

python manage.py createsuperuser

Run the Django development server:

python manage.py runserver

    The backend will be available at http://127.0.0.1:8000/

Frontend (Angular)
Navigate to the frontend directory:

cd [project]/[bookstore-frontend]

Install dependencies:

npm install

Run the Angular development server:

ng serve --open

    The frontend will be available at http://localhost:4200/ and should open automatically in your browser.

Usage

    The main application interface is accessed via the frontend (http://localhost:4200/).
    The backend API is available at (http://127.0.0.1:8000/api/ - replace /api/ with your actual API prefix).
    The Django Admin panel is available at (http://127.0.0.1:8000/admin/).

