# School Forum Web Application - Project Documentation

## 1. Project Overview

### Project Name
**School Forum** - A full-stack web application for academic discussion and collaboration

### Purpose and Goals
This project is a comprehensive forum application designed for educational institutions, allowing students and faculty to:
- Engage in academic discussions
- Seek and provide homework help
- Organize study groups
- Share knowledge and resources
- Manage user roles and content moderation

### Main Features

#### User Management
- **User Registration & Authentication**: Secure registration and login with JWT-based authentication
- **User Roles**: Three-tier role system (USER, MODERATOR, ADMIN) with different permissions
- **User Profiles**: Customizable profiles with bio, avatar, and activity tracking
- **User Management**: Admin panel for user management, banning/unbanning users

#### Thread Management
- **Create Threads**: Users can create discussion threads in various categories
- **Thread Categories**: Organized into categories (General Discussion, Homework Help, Programming & Tech, etc.)
- **Thread Features**: 
  - Pinning important threads (Admin only)
  - Anonymous posting option

#### Reply System
- **Post Replies**: Users can reply to threads
- **Anonymous Replies**: Option to post anonymously
- **Thread Viewing**: View thread details with all replies

#### Search & Filtering
- **Category Filtering**: Filter threads by category
- **Pagination**: Efficient pagination for large thread lists
- **Sorting**: Sort threads by creation date, last reply, etc.

#### Additional Features
- **Tags System**: Tag threads for better organization
- **Responsive Design**: Modern UI built with Tailwind CSS
- **RESTful API**: Well-structured backend API

---

## 2. Installation & Setup

### Prerequisites
- **Java**: JDK 21 or higher
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **MySQL**: Version 8.0 or higher
- **Maven**: 3.9.x or higher (included via Maven Wrapper)

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd pj-forum/back
```

#### Step 2: Configure Database
1. Create MySQL database:
```sql
CREATE DATABASE forum_db;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/forum_db?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

#### Step 3: Set Java Environment (if needed)
```bash
# Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Linux/Mac
export JAVA_HOME=/path/to/jdk-21
export PATH=$JAVA_HOME/bin:$PATH
```

#### Step 4: Build and Run
```bash
# Using Maven Wrapper (recommended)
./mvnw.cmd clean compile        # Windows
./mvnw clean compile            # Linux/Mac

# Run the application
./mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run          # Linux/Mac
```

The backend will start on **http://localhost:8080**

#### Step 5: Seed Database (Optional)
```bash
# Using MySQL command line
mysql -u root -p forum_db < database-seed.sql

# Or use the fixed version
mysql -u root -p forum_db < database-seed-fixed.sql
```

**Note**: The application uses `spring.jpa.hibernate.ddl-auto=update`, which automatically creates/updates tables. You only need to create the database manually.

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd pj-forum/front
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure API Endpoint
The API URL is configured in `src/api/index.js`. Default is:
```javascript
const API_URL = 'http://localhost:8080/api';
```

#### Step 4: Run Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

### Configuration Files

#### Backend Configuration
- **`application.properties`**: Main configuration file containing:
  - Database connection settings
  - JWT secret and expiration
  - CORS allowed origins
  - Server port (default: 8080)
  - Logging levels

#### Frontend Configuration
- **`vite.config.js`**: Vite build configuration
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`package.json`**: Node.js dependencies and scripts

### Environment Variables
Currently, all configuration is in `application.properties`. For production, consider using environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

---

## 3. Usage Instructions

### Running the Project Locally

#### Start Backend
1. Ensure MySQL is running
2. Navigate to `pj-forum/back`
3. Run: `./mvnw.cmd spring-boot:run` (Windows) or `./mvnw spring-boot:run` (Linux/Mac)
4. Wait for "School Forum Backend is running!" message

#### Start Frontend
1. Navigate to `pj-forum/front`
2. Run: `npm run dev`
3. Open browser to `http://localhost:3000`

### Example Workflows

#### Workflow 1: Creating an Account and Posting a Thread

1. **Register New Account**
   - Navigate to `/register`
   - Fill in username, email, and password
   - Click "Register"
   - You'll be automatically logged in

2. **Browse Categories**
   - On the home page, click on a category card
   - View threads in that category

3. **Create a Thread**
   - Click "Create Thread" button (requires login)
   - Select a category
   - Enter thread title and content
   - Optionally select tags
   - Choose if you want to post anonymously
   - Click "Submit"

4. **View Your Thread**
   - Your thread appears in the category
   - Click on it to view full details

#### Workflow 2: Replying to a Thread

1. **Navigate to Thread**
   - Click on any thread from the home page or category page

2. **Post a Reply**
   - Scroll to the reply section
   - Enter your reply content
   - Optionally post anonymously
   - Click "Post Reply"

3. **View Replies**
   - All replies appear below the thread
   - Replies are ordered by creation date

#### Workflow 3: Admin Functions

1. **Login as Admin**
   - Use admin credentials (from seed data: `admin@school.edu` / `password123`)

2. **Manage Users**
   - Navigate to `/users`
   - View all users
   - Ban/unban users as needed

3. **Moderate Threads**
   - Pin important threads
   - Delete inappropriate content

---

## 4. Folder Structure

### Backend Structure (`pj-forum/back/`)

```
back/
├── src/
│   └── main/
│       ├── java/com/schoolforum/
│       │   ├── config/              # Configuration classes
│       │   │   ├── CorsConfig.java          # CORS configuration
│       │   │   ├── GlobalExceptionHandler.java  # Global error handling
│       │   │   ├── JwtConfig.java          # JWT configuration
│       │   │   └── SecurityConfig.java     # Spring Security setup
│       │   ├── controller/          # REST API Controllers
│       │   │   ├── AdminController.java    # Admin operations
│       │   │   ├── AuthController.java     # Authentication endpoints
│       │   │   ├── CategoryController.java # Category management
│       │   │   ├── ReplyController.java    # Reply management
│       │   │   ├── ThreadController.java    # Thread management
│       │   │   └── UserController.java     # User management
│       │   ├── dao/                 # Data Access Objects (JPA Repositories)
│       │   │   ├── CategoryDAO.java
│       │   │   ├── ReplyDAO.java
│       │   │   ├── TagDAO.java
│       │   │   ├── ThreadDAO.java
│       │   │   └── UserDAO.java
│       │   ├── dto/                 # Data Transfer Objects
│       │   │   ├── AuthResponse.java
│       │   │   ├── CategoryDTO.java
│       │   │   ├── CreateThreadRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── RegisterRequest.java
│       │   │   ├── ReplyDTO.java
│       │   │   ├── ThreadDTO.java
│       │   │   └── UserDTO.java
│       │   ├── model/               # Entity Models (JPA)
│       │   │   ├── Category.java
│       │   │   ├── Reply.java
│       │   │   ├── Tag.java
│       │   │   ├── Thread.java
│       │   │   └── User.java
│       │   ├── security/            # Security components
│       │   │   └── JwtAuthenticationFilter.java
│       │   ├── service/             # Business Logic Layer
│       │   │   ├── AuthService.java
│       │   │   ├── ReplyService.java
│       │   │   ├── ScheduledTaskService.java
│       │   │   └── ThreadService.java
│       │   ├── util/                # Utility classes
│       │   │   └── JwtUtil.java     # JWT token operations
│       │   └── ForumApplication.java # Main application class
│       └── resources/
│           └── application.properties  # Application configuration
├── database-seed.sql              # Database seed data
├── pom.xml                        # Maven dependencies
└── mvnw.cmd / mvnw               # Maven wrapper

```

**Key Directories:**
- **`controller/`**: Handles HTTP requests and responses (REST API endpoints)
- **`service/`**: Contains business logic and orchestrates data operations
- **`dao/`**: JPA repositories for database access
- **`model/`**: JPA entity classes representing database tables
- **`dto/`**: Data Transfer Objects for API requests/responses
- **`config/`**: Configuration classes for security, CORS, etc.

### Frontend Structure (`pj-forum/front/`)

```
front/
├── src/
│   ├── api/                       # API client configuration
│   │   └── index.js               # Axios setup and API methods
│   ├── components/                 # Reusable React components
│   │   ├── common/                 # Common components
│   │   │   ├── CategoryCard.jsx
│   │   │   └── Loading.jsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Navbar.jsx
│   │   └── thread/                 # Thread-related components
│   │       ├── ReplyBox.jsx
│   │       └── ThreadRow.jsx
│   ├── contexts/                   # React Context providers
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── pages/                      # Page components (routes)
│   │   ├── Category/
│   │   │   └── Category.jsx
│   │   ├── CreateThread/
│   │   │   └── CreateThread.jsx
│   │   ├── EditThread/
│   │   │   └── EditThread.jsx
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Login/
│   │   │   └── Login.jsx
│   │   ├── Profile/
│   │   │   ├── EditProfile.jsx
│   │   │   └── Profile.jsx
│   │   ├── Register/
│   │   │   └── Register.jsx
│   │   ├── Settings/
│   │   │   └── Settings.jsx
│   │   ├── Thread/
│   │   │   └── ThreadPage.jsx
│   │   └── UserManagement/
│   │       └── UserManagement.jsx
│   ├── styles/                     # Global styles
│   │   └── index.css
│   ├── App.jsx                     # Main app component with routing
│   └── main.jsx                    # Application entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── tailwind.config.js             # Tailwind CSS configuration

```

**Key Directories:**
- **`pages/`**: Main page components corresponding to routes
- **`components/`**: Reusable UI components
- **`contexts/`**: React Context for global state (authentication)
- **`api/`**: Centralized API client with Axios

---

## 5. Backend API Overview

### Base URL
All API endpoints are prefixed with `/api`

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### API Endpoints

#### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout (frontend handles) | Yes |

**Register Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Category Endpoints (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/categories/{id}` | Get category by ID | No |
| POST | `/api/categories` | Create category | Admin only |

**Get Categories Response:**
```json
[
  {
    "id": 1,
    "name": "General Discussion",
    "slug": "general",
    "description": "General topics and casual conversations",
    "icon": "💬",
    "displayOrder": 1
  }
]
```

#### Thread Endpoints (`/api/threads`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/threads` | Get all threads (paginated) | No |
| GET | `/api/threads/{id}` | Get thread by ID | No |
| GET | `/api/threads/category/{categoryId}` | Get threads by category | No |
| POST | `/api/threads` | Create new thread | Yes |
| PUT | `/api/threads/{id}` | Update thread | Author/Mod/Admin |
| DELETE | `/api/threads/{id}` | Delete thread | Author/Mod/Admin |
| POST | `/api/threads/{id}/pin` | Pin/unpin thread | Admin only |

**Query Parameters for GET `/api/threads`:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `sort`: Sort field (default: "createdAt")
- `categoryId`: Filter by category (optional)

**Create Thread Request Body:**
```json
{
  "title": "How to solve this problem?",
  "content": "I need help with...",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "isAnonymous": false
}
```

**Thread Response:**
```json
{
  "id": 1,
  "title": "How to solve this problem?",
  "content": "I need help with...",
  "author": {
    "id": 1,
    "username": "john_doe"
  },
  "category": {
    "id": 1,
    "name": "General Discussion"
  },
  "tags": [
    {"id": 1, "name": "java"}
  ],
  "isPinned": false,
  "createdAt": "2025-12-22T10:00:00",
  "lastReplyAt": "2025-12-22T11:00:00"
}
```

#### Reply Endpoints (`/api/threads/{threadId}/replies`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/threads/{threadId}/replies` | Get all replies for a thread | No |
| POST | `/api/threads/{threadId}/replies` | Create new reply | Yes |

**Create Reply Request Body:**
```json
{
  "content": "This is my reply...",
  "isAnonymous": false
}
```

**Reply Response:**
```json
{
  "id": 1,
  "content": "This is my reply...",
  "author": {
    "id": 1,
    "username": "john_doe"
  },
  "isAnonymous": false,
  "createdAt": "2025-12-22T10:00:00"
}
```

#### User Endpoints (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/{id}` | Get user by ID | No |
| GET | `/api/users/me` | Get current user | Yes |
| PUT | `/api/users/{id}` | Update user | Owner/Admin |
| PUT | `/api/users/{id}/ban` | Ban user | Admin only |
| PUT | `/api/users/{id}/unban` | Unban user | Admin only |

---

## 6. Frontend Overview

### Main Pages

1. **Home Page** (`/`)
   - Displays all categories
   - Shows recent/popular threads
   - Navigation to different sections

2. **Login Page** (`/login`)
   - User authentication form
   - Redirects to home after successful login

3. **Register Page** (`/register`)
   - New user registration form
   - Validates username, email, and password

4. **Category Page** (`/category/:id`)
   - Lists all threads in a specific category
   - Pagination support
   - Filter and sort options

5. **Thread Page** (`/thread/:id`)
   - Displays full thread content
   - Shows all replies
   - Reply form for authenticated users

6. **Create Thread Page** (`/create-thread`)
   - Form to create new threads
   - Category and tag selection
   - Anonymous posting option

7. **Edit Thread Page** (`/edit-thread/:id`)
   - Edit existing threads (author only)
   - Pre-filled form with current data

8. **User Management** (`/users`)
   - Admin panel for user management
   - Ban/unban functionality
   - User list with roles

### State Management

The application uses **React Context API** for global state management:

- **AuthContext**: Manages authentication state
  - Current user information
  - Login/logout functions
  - Token management
  - Persists user data in localStorage

**Example Usage:**
```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.username}!</div>;
}
```

### API Integration

The frontend uses **Axios** for HTTP requests, configured in `src/api/index.js`:

- **Automatic Token Injection**: Axios interceptor adds JWT token to all requests
- **Error Handling**: Automatic redirect to login on 401 errors
- **Centralized Configuration**: All API calls go through a single axios instance

**Example API Call:**
```javascript
import { threadsAPI } from './api';

// Get all threads
const response = await threadsAPI.getAll({ page: 0, size: 20 });
const threads = response.data;

// Create a thread
const newThread = await threadsAPI.create({
  title: "My Thread",
  content: "Thread content...",
  categoryId: 1
});
```

### Routing

The application uses **React Router v6** for client-side routing:

- All routes defined in `App.jsx`
- Protected routes handled by checking authentication state
- Dynamic routes for thread and category pages

---

## 7. Code Highlights

### Backend Highlights

#### 1. JWT Authentication Filter
The `JwtAuthenticationFilter` intercepts requests and validates JWT tokens:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) {
        String token = extractToken(request);
        if (token != null && jwtUtil.validateToken(token)) {
            // Set authentication in SecurityContext
        }
        filterChain.doFilter(request, response);
    }
}
```

#### 2. Service Layer Pattern
Business logic is separated in service classes. Example from `ThreadService`:

```java
@Service
public class ThreadService {
    public ThreadDTO createThread(CreateThreadRequest request, Long userId) {
        User author = userDAO.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Thread thread = new Thread();
        thread.setTitle(request.getTitle());
        thread.setContent(request.getContent());
        thread.setAuthor(author);
        // ... set other fields
        
        Thread saved = threadDAO.save(thread);
        return convertToDTO(saved);
    }
}
```

#### 3. DTO Pattern
Data Transfer Objects separate API contracts from entity models:

```java
@Data
public class ThreadDTO {
    private Long id;
    private String title;
    private String content;
    private AuthorDTO author;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private boolean isPinned;
    private LocalDateTime createdAt;
}
```

#### 4. Role-Based Access Control
Spring Security `@PreAuthorize` annotations enforce permissions:

```java
@DeleteMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Void> deleteThread(@PathVariable Long id, 
                                         HttpServletRequest request) {
    Long userId = extractUserId(request);
    String role = extractRole(request);
    threadService.deleteThread(id, userId, role);
    return ResponseEntity.noContent().build();
}
```

### Frontend Highlights

#### 1. Authentication Context
Centralized authentication state management:

```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 2. Axios Interceptors
Automatic token injection and error handling:

```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 3. Protected Routes
Route protection using authentication context:

```javascript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

---

## 8. Conclusion / Notes

### Limitations & Known Issues

1. **JWT Token Storage**: Tokens are stored in localStorage, which is vulnerable to XSS attacks. Consider using httpOnly cookies for production.

2. **No Real-time Updates**: New replies require page refresh. Consider implementing WebSockets for real-time features.

3. **File Upload**: File upload functionality is configured but not fully implemented in the UI.

4. **Search Functionality**: Basic search is not implemented. Consider adding full-text search capabilities.

5. **Email Verification**: User registration doesn't include email verification.

6. **Password Reset**: Password reset functionality is not implemented.

### Tips for Running & Testing

1. **Database Setup**: Ensure MySQL is running before starting the backend. The application will auto-create tables on first run.

2. **Port Conflicts**: If port 8080 (backend) or 3000 (frontend) is in use, update the configuration files accordingly.

3. **CORS Issues**: If you change frontend port, update `cors.allowed-origins` in `application.properties`.

4. **Testing with Seed Data**: Use the provided `database-seed.sql` to populate sample data for testing. Default admin credentials: `admin@school.edu` / `password123`.

5. **Development Mode**: Both backend and frontend support hot-reload during development.

6. **Logging**: Backend logging is set to DEBUG level. Check console for detailed request/response logs.

### Recommendations for Future Improvements

1. **Real-time Features**
   - Real-time reply updates without page refresh

2. **Enhanced Search**
   - Full-text search across threads and replies
   - Advanced filtering options
   - Search by tags, author, date range

3. **Rich Text Editor**
   - Replace plain text areas with a rich text editor
   - Support for markdown, code blocks, images

4. **User Features**
   - Email verification on registration
   - Password reset functionality
   - User avatars and profile customization
   - Activity history and statistics

5. **Moderation Tools**
   - Report content functionality
   - Moderation queue
   - Content flagging system

6. **Performance Optimizations**
   - Implement caching for frequently accessed data
   - Database query optimization
   - Image optimization and CDN integration

7. **Security Enhancements**
   - Rate limiting for API endpoints
   - CSRF protection
   - Input sanitization
   - SQL injection prevention (already handled by JPA)

8. **Testing**
   - Unit tests for services and utilities
   - Integration tests for API endpoints
   - Frontend component tests
   - End-to-end testing

9. **Documentation**
   - API documentation with Swagger/OpenAPI
   - Code comments and Javadoc
   - User guide and help documentation

10. **Deployment**
    - Docker containerization
    - CI/CD pipeline setup
    - Production environment configuration
    - Monitoring and logging solutions

---

## Appendix: Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Build Tool**: Maven 3.9.x
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Validation**: Jakarta Validation

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router 6.20.1
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.6
- **Language**: JavaScript (ES6+)

### Development Tools
- **Version Control**: Git
- **Package Management**: npm (frontend), Maven (backend)
- **Code Quality**: Lombok (backend), ESLint (frontend)

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: School Forum Development Team




