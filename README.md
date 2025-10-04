## 📚 Library Management System
Library Management System is a full-stack web application designed to manage books, users, borrowing/returning transactions, and reviews in a library.
The project is built with React.js (frontend) and Node.js/Express (backend), with MongoDB/MySQL as the database.

# 🚀 Features
👤 User Management
User registration, login, and authentication
Role-based access: Admin / User

📖 Book Management
Add, edit, delete, and categorize books
View book details, search, and filter options

🔄 Borrow & Return
Record borrow/return transactions
Manage borrowed books, due dates, and overdue books

⭐ Reviews & Ratings
Users can write and view reviews
Recommended books section

📊 Dashboard
Statistics on books, users, and transactions
Visual reports

⚡ Installation & Running
1. Clone the repository
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system

2. Install dependencies
Backend:
cd backend
npm install
Frontend:
cd frontend
npm install

3. Configure environment variables
Create a .env file inside the backend/ folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/librarydb
JWT_SECRET=your_jwt_secret

4. Run the project
Start backend:
npm run server
Start frontend:
npm start
Or run both using Docker Compose:
docker compose up -d

🛠 Tech Stack
Frontend: React.js, Context API, CSS Modules
Backend: Node.js, Express.js
Database: MongoDB / MySQL (depending on configuration)
Authentication: JWT
Deployment: Docker Compose

👤 Author
Nguyen Yen Ngoc
Nguyen Nguyen Minh
Hua Bao Ngoc
Nguyen Dung
Dao Phuong Nam
Truong Dang Minh Khue
Nguyen Khanh Hoang Minh
📖 References
React Documentation
Express Documentation

MongoDB Documentation

Docker Compose
