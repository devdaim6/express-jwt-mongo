# express-jwt-mongo

This npm package provides a CLI tool to quickly scaffold a secure Express server with JWT authentication and MongoDB integration. It sets up a basic project structure with essential security features already implemented.

## Features

- Express server setup with security middleware
- MongoDB integration
- JWT-based authentication
- Basic user registration and login
- Protected route example
- Organized folder structure (MVC pattern)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12.0.0 or higher)
- MongoDB (Make sure it's installed and running)

## Installation

To use this package, you can run it directly using npx:

```
npx express-jwt-mongo my-project-name
```

Or you can install it globally:

```
npm install -g express-jwt-mongo
express-jwt-mongo my-project-name
```

## Usage

After running the scaffold command, navigate to your new project directory:

```
cd my-project-name
```

Install the dependencies:

```
npm install
```

Create a `.env` file in the root directory and add the following:

```
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

Replace `your_database_name` with your desired database name and `your_jwt_secret_key` with a strong, unique secret key.

To start the server, run:

```
npm start
```

The server will start on the port specified in your `.env` file (default is 3000).

### API Endpoints

1. Register a new user:
   - POST `/api/auth/register`
   - Body: `{ "username": "your_username", "password": "your_password" }`

2. Login:
   - POST `/api/auth/login`
   - Body: `{ "username": "your_username", "password": "your_password" }`

3. Access protected route (requires authentication):
   - GET `/api/protected`
   - Header: `Authorization: Bearer your_jwt_token`

## Folder Structure

The scaffolded project will have the following structure:

```
my-project-name/
├── controllers/
│   └── authController.js
├── routes/
│   └── auth.js
├── models/
│   └── User.js
├── middleware/
│   └── auth.js
├── server.js
├── .env
└── package.json
```

## Customization

You can extend the scaffolded project by:

1. Adding more routes in the `routes/` directory
2. Creating new controllers in the `controllers/` directory
3. Adding new models in the `models/` directory
4. Implementing additional middleware in the `middleware/` directory

## Security Features

This scaffold includes several security features:

- CORS (Cross-Origin Resource Sharing)
- Helmet (sets various HTTP headers)
- Rate limiting (prevents brute-force attacks)
- JWT authentication (secures routes)
- Password hashing (using bcrypt)

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## License

[MIT](./LICENSE)

