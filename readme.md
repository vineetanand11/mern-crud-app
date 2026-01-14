# Full Stack User Management Application

A complete full stack application with user authentication, user management, and location services built with Node.js, Express, MongoDB, and React.

## Features

### Backend
- RESTful API with Express.js
- User authentication (login/register)
- JWT-based authentication
- User management (CRUD operations)
- Location management
- MongoDB database integration
- CORS enabled

### Frontend
- Modern React application
- Protected routes with authentication
- Admin dashboard
- User management interface
- Location services
- Responsive design
- Form validation
- Reusable components

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS/SCSS** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Project Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── userRoutes.js            # User management routes
│   │   └── locationRoutes.js        # Location routes
│   ├── models/                      # Database models
│   ├── middleware/                  # Custom middleware
│   ├── controllers/                 # Route controllers
│   ├── seeder/                      # ImportCountriesSeeder
│   ├── .env                         # Environment variables
│   ├── server.js                    # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FormInput.jsx        # Reusable form input
    │   │   ├── SelectInput.jsx      # Reusable select dropdown
    │   │   └── ProtectedRoute.jsx   # Route protection
    │   ├── layouts/
    │   │   └── UsersLayout.jsx      # Layout wrapper
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   └── AdminDashboard.jsx
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── users/
    │   │   │   └── EditUser.jsx
    │   │   └── UserList.jsx
    │   ├── services/
    │   │   ├── auth.services.js     # Authentication API calls
    │   │   ├── user.services.js     # User API calls
    │   │   └── location.services.js # Location API calls
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── .env
    └── package.json
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-root
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

Start the frontend server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Users (`/api/users`)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Location (`/api/location`)
- `GET /api/location/countries` - Get all countries
- `GET /api/location/states/:countryId` - Get states by country
- `GET /api/location/cities/:stateId` - Get city by state
- `GET /api/location/country/:id` - Get country by id
- `GET /api/location/state/:id` - Get state by id
- `GET /api/location/city/:id` - Get city by id

### Import Country, State And City
-`seeder/ImportCountriesSeeder` - Import All Countries, States And Cities

## Frontend Routes

```
/                          → Home/Dashboard
/login                     → Login page
/register                  → Registration page
/users                     → User list (Protected)
/users/:id/edit            → Edit user (Protected)
/admin/dashboard           → Admin dashboard (Admin only)
```

## Components Documentation

### FormInput Component
```jsx
<FormInput
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  placeholder="Enter your email"
  required
/>
```

### SelectInput Component
```jsx
<SelectInput
  label="Role"
  name="role"
  value={role}
  onChange={handleChange}
  options={[
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ]}
/>
```

### ProtectedRoute Component
```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

## Service Layer

### auth.services.js
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `getCurrentUser()` - Get current user

### user.services.js
- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch single user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user

### location.services.js
- `getCountries()` - Fetch all Countries
- `getStatesByCountry(countryId)` - Get State By Country
- `getCitiesByState(stateId)` - Get City By State
- `getCountryById(id)` - Get Country By Id
- `getStateById(id)` - Get State By Id
- `getCityById(id)` - Get City By Id

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Location Model
```javascript
{
  name: String,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage/sessionStorage
5. Token included in Authorization header for subsequent requests
6. ProtectedRoute component checks for valid token
7. Redirect to login if token is invalid or expired

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/dbname` |
| `JWT_SECRET` | Secret key for JWT | `your-secret-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_ENV` | Environment mode | `development` or `production` |

## Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject CRA configuration
```

## Security Features

- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected routes on frontend and backend
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data
- Role-based access control (Admin vs User)

## Error Handling

### Backend Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information"
}
```

### Frontend Error Handling
- Global error boundary component
- Form validation errors
- API error messages displayed to users
- Network error handling
- 404 page for invalid routes

## Development Workflow

1. Start MongoDB server
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm start`
4. Access application at `http://localhost:3000`
5. Backend API available at `http://localhost:5000`

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `build` folder to your hosting service.

## Deployment

### Backend Deployment
- **Heroku**
- **AWS EC2**
- **DigitalOcean**
- **Railway**

### Frontend Deployment
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Update CORS origins in backend
- [ ] Build frontend for production
- [ ] Set up MongoDB Atlas for production database
- [ ] Configure SSL/HTTPS
- [ ] Set up CI/CD pipeline

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test                    # Run tests
npm test -- --coverage      # Run with coverage
```

## Troubleshooting

### Common Issues

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env file
- Verify database permissions

**CORS errors:**
- Check backend CORS configuration
- Verify REACT_APP_API_URL in frontend .env
- Ensure backend server is running

**Authentication issues:**
- Clear localStorage/sessionStorage
- Check JWT_SECRET matches on backend
- Verify token expiration settings

**Port already in use:**
```bash
# Kill process on port 5000 (backend)
kill -9 $(lsof -t -i:5000)

# Kill process on port 3000 (frontend)
kill -9 $(lsof -t -i:3000)
```

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Caching with Redis (optional)
- Compression middleware
- Query optimization

### Frontend
- Code splitting with React.lazy
- Memoization with useMemo/useCallback
- Image optimization
- Lazy loading components
- Bundle size optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.

## Authors

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/project](https://github.com/yourusername/project)

## Acknowledgments

- React documentation
- Express.js documentation
- MongoDB documentation
- Community contributors