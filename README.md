# pj-forum

A thread-based discussion forum inspired by vozForums, built with Node.js, Express, and SQLite.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Categories**: Organize discussions into different categories
- **Topics & Posts**: Create topics and reply to discussions
- **Role-Based Access Control**: Support for regular users, moderators, and admins
- **Moderation Tools**: Pin/unpin topics, lock/unlock discussions, delete content
- **Real-time Updates**: View counts, reply counts, and timestamps
- **Responsive Design**: Clean and modern UI that works on all devices

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Security**: bcryptjs for password hashing, express-validator for input validation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tengukosho/pj-forum.git
cd pj-forum
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```
Edit the `.env` file to set your JWT secret and port (defaults are provided).

4. Start the server:
```bash
npm start
```

The forum will be available at `http://localhost:3000`

## Usage

### First Time Setup

1. **Register an Account**: Navigate to `/register` and create your account
2. **Create Categories** (Admin only): The first user is not automatically admin. You can manually update the database or create categories through the API
3. **Create Topics**: Once logged in and categories exist, you can create new topics
4. **Post Replies**: Engage in discussions by posting replies

### User Roles

- **User**: Can create topics, post replies, edit/delete own posts
- **Moderator**: All user permissions + pin/unpin topics, lock/unlock topics, moderate content
- **Admin**: All permissions + create/edit/delete categories

### Upgrading Users to Admin/Moderator

To promote a user to admin or moderator, you need to update the database directly:

```bash
# Using sqlite3 command line
sqlite3 forum.db "UPDATE users SET role='admin' WHERE username='yourusername';"
```

Or use a SQLite GUI tool to update the `role` field in the `users` table.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category with topics
- `POST /api/categories` - Create a new category (Admin only)
- `PUT /api/categories/:id` - Update a category (Admin only)
- `DELETE /api/categories/:id` - Delete a category (Admin only)

### Topics
- `GET /api/topics` - Get all topics (paginated)
- `GET /api/topics/:id` - Get a specific topic with posts
- `POST /api/topics` - Create a new topic (Authenticated)
- `PUT /api/topics/:id` - Update a topic (Owner or Moderator)
- `PATCH /api/topics/:id/pin` - Pin/unpin a topic (Moderator only)
- `PATCH /api/topics/:id/lock` - Lock/unlock a topic (Moderator only)
- `DELETE /api/topics/:id` - Delete a topic (Owner or Moderator)

### Posts
- `POST /api/posts` - Create a new post/reply (Authenticated)
- `PUT /api/posts/:id` - Update a post (Owner or Moderator)
- `DELETE /api/posts/:id` - Delete a post (Owner or Moderator)

## Project Structure

```
pj-forum/
├── src/
│   ├── models/
│   │   └── database.js         # Database initialization and schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── categories.js       # Category management routes
│   │   ├── topics.js           # Topic management routes
│   │   └── posts.js            # Post/reply management routes
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   └── server.js               # Main server file
├── public/
│   ├── css/
│   │   └── style.css           # Styling
│   ├── js/
│   │   ├── auth.js             # Authentication utilities
│   │   ├── main.js             # Homepage logic
│   │   ├── category.js         # Category page logic
│   │   ├── topic.js            # Topic page logic
│   │   ├── login.js            # Login page logic
│   │   └── register.js         # Registration page logic
│   ├── index.html              # Homepage
│   ├── category.html           # Category view
│   ├── topic.html              # Topic view
│   ├── login.html              # Login page
│   └── register.html           # Registration page
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Database Schema

The forum uses SQLite with the following tables:

- **users**: User accounts and authentication
- **categories**: Forum categories
- **topics**: Discussion topics
- **posts**: Posts and replies

## Development

To run in development mode:
```bash
npm run dev
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection through input escaping
- CORS enabled for API access

## License

ISC

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.