# School Forum Web Application

A full-stack web application for academic discussions, homework help, and study group organization. Built with Spring Boot and React, this forum platform enables students and lecturers to engage in structured academic conversations.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 📋 Description

School Forum is a comprehensive discussion platform designed for educational institutions. It provides a structured environment where students can ask questions, share knowledge, organize study groups, and collaborate on academic topics. The application features role-based access control, allowing administrators and moderators to maintain content quality while giving users the freedom to express themselves.

### Key Highlights
- **Secure Authentication**: JWT-based authentication system
- **Role-Based Access**: Three-tier permission system (USER, MODERATOR, ADMIN)
- **Rich Content Management**: Threads, replies, categories, and tags
- **User Engagement**: Notifications, subscriptions, and activity tracking
- **Modern UI**: Responsive design with Tailwind CSS

## ✨ Features

### User Management
- User registration and authentication
- Profile management
- Role-based permissions (USER, MODERATOR, ADMIN)
- User banning/unbanning (Admin only)

### Thread Management
- Create, edit, and delete threads
- Thread categorization
- Tag system for better organization
- Pin important threads (Admin)
- Lock threads to prevent replies (Moderator/Admin)
- Anonymous posting option
- Pagination and sorting

### Reply System
- Post replies to threads
- Anonymous replies
- Thread view tracking

### Additional Features
- **Notifications**: Real-time notifications for replies and updates
- **Thread Subscriptions**: Subscribe to threads for notifications
- **Search & Filter**: Filter threads by category, sort by date
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Well-structured backend API

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven 3.9.x

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router 6.20.1
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.6

## 🚀 Installation

### Prerequisites
- Java JDK 21 or higher
- Node.js 18.x or higher
- npm 9.x or higher
- MySQL 8.0 or higher
- Maven 3.9.x (or use Maven Wrapper included in project)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pj-forum/pj-forum/back
   ```

2. **Create MySQL database**
   ```sql
   CREATE DATABASE forum_db;
   ```

3. **Configure database connection**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/forum_db?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

4. **Set Java environment** (if needed)
   ```bash
   # Windows PowerShell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
   
   # Linux/Mac
   export JAVA_HOME=/path/to/jdk-21
   ```

5. **Build and run**
   ```bash
   # Using Maven Wrapper
   ./mvnw.cmd clean compile    # Windows
   ./mvnw clean compile         # Linux/Mac
   
   ./mvnw.cmd spring-boot:run   # Windows
   ./mvnw spring-boot:run       # Linux/Mac
   ```

   Backend will start on **http://localhost:8080**

6. **Seed database (optional)**
   ```bash
   mysql -u root -p forum_db < database-seed.sql
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will start on **http://localhost:3000**

## 📖 Usage

### Starting the Application

1. **Start MySQL server**
   ```bash
   # Ensure MySQL is running
   mysql -u root -p
   ```

2. **Start backend** (in `pj-forum/back` directory)
   ```bash
   ./mvnw.cmd spring-boot:run
   ```

3. **Start frontend** (in `pj-forum/front` directory)
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api`

### Basic Workflow

1. **Register/Login**
   - Navigate to `/register` to create an account
   - Or use `/login` with existing credentials
   - Default admin: `admin@school.edu` / `password123` (from seed data)

2. **Browse Categories**
   - Home page displays all categories
   - Click on a category to view threads

3. **Create Thread**
   - Click "Create Thread" (requires login)
   - Select category, enter title and content
   - Optionally add tags and post anonymously

4. **Reply to Thread**
   - Open any thread
   - Scroll to reply section
   - Enter reply and submit

5. **Admin Functions** (Admin role required)
   - Navigate to `/users` for user management
   - Pin/lock threads from thread page
   - Ban/unban users

## 📁 Folder Structure

```
pj-forum/
├── back/                          # Spring Boot Backend
│   ├── src/main/java/com/schoolforum/
│   │   ├── config/                # Configuration (Security, CORS, JWT)
│   │   ├── controller/            # REST API Controllers
│   │   ├── service/                # Business Logic Layer
│   │   ├── dao/                    # Data Access Objects (JPA Repositories)
│   │   ├── model/                  # Entity Models
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── security/               # Security Components
│   │   └── util/                   # Utility Classes
│   ├── src/main/resources/
│   │   └── application.properties # Application Configuration
│   ├── database-seed.sql          # Database seed data
│   └── pom.xml                    # Maven Dependencies
│
└── front/                         # React Frontend
    ├── src/
    │   ├── api/                   # API Client (Axios)
    │   ├── components/            # Reusable Components
    │   ├── pages/                 # Page Components (Routes)
    │   ├── contexts/               # React Context (Auth)
    │   └── styles/                 # Global Styles
    ├── package.json               # Dependencies
    └── vite.config.js             # Vite Configuration
```

## 🔌 API Examples

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Thread Operations

**Get All Threads (Paginated)**
```http
GET /api/threads?page=0&size=20&sort=createdAt&categoryId=1
Authorization: Bearer <token>
```

**Create Thread**
```http
POST /api/threads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to solve this problem?",
  "content": "I need help with...",
  "categoryId": 1,
  "tagIds": [1, 2],
  "isAnonymous": false
}
```

**Get Thread Replies**
```http
GET /api/threads/1/replies
```

For complete API documentation, see `PROJECT_DOCUMENTATION.md`.

## 🧪 Testing

### Test Accounts (from seed data)
- **Admin**: `admin@school.edu` / `password123`
- **Moderator**: `mod_john@school.edu` / `password123`
- **User**: `alice@student.edu` / `password123`

### Manual Testing
1. Register a new account
2. Create a thread in any category
3. Reply to existing threads
4. Test admin functions (pin, lock, ban users)

## 📝 Configuration

### Backend Configuration
Edit `back/src/main/resources/application.properties`:
- Database connection settings
- JWT secret and expiration
- CORS allowed origins
- Server port (default: 8080)

### Frontend Configuration
- API URL: `front/src/api/index.js` (default: `http://localhost:8080/api`)
- Port: `front/vite.config.js` (default: 3000)

## 🐛 Known Issues & Limitations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- No real-time updates (requires page refresh)
- Email verification not implemented
- Password reset functionality not available
- Basic search not implemented

## 🔮 Future Improvements

- Real-time notifications with WebSockets
- Full-text search functionality
- Rich text editor for content
- Email verification and password reset
- File upload support
- Advanced moderation tools
- User activity statistics

## 📄 License

This project is developed for academic purposes.

## 👤 Author

**School Forum Development Team**

- **Project**: School Forum Web Application
- **Course**: [Your Course Name]
- **Institution**: [Your Institution]

## 📞 Contact

For questions or issues regarding this project, please contact:
- Email: [your-email@example.com]
- GitHub: [your-github-username]

---

**Note**: This project is developed as part of an academic course. For production use, additional security measures, testing, and optimizations are recommended.

