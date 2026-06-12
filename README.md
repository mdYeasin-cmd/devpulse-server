# DevPulse Server

DevPulse Server is a TypeScript-based REST API for managing software issues. It supports user authentication, role-based access control, and issue tracking with PostgreSQL persistence.

## Live URL

```text
https://devpulse-server-pi.vercel.app/
```

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization for contributors and maintainers
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- PostgreSQL database initialization on server startup

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- pg
- JSON Web Token
- bcryptjs
- dotenv
- cors

## Setup Steps

1. Clone the repository.

```bash
git clone <repository-url>
cd assignment_2
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.

```env
PORT=5000
CONNECTION_STRING=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET_KEY=<your-jwt-secret>
```

4. Start the development server.

```bash
npm run dev
```

5. Open the server health route.

```text
http://localhost:5000
```

The server creates the required database tables automatically when it starts.

## Environment Variables

| Variable            | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `PORT`              | Port where the server runs. Defaults to `5000` if not provided. |
| `CONNECTION_STRING` | PostgreSQL database connection string.                          |
| `JWT_SECRET_KEY`    | Secret key used to sign and verify JWT access tokens.           |

## API Endpoints

Base URL:

```text
https://your-live-url.com
```

For local development:

```text
http://localhost:5000
```

### Health Check

| Method | Endpoint | Description                                 | Auth Required |
| ------ | -------- | ------------------------------------------- | ------------- |
| `GET`  | `/`      | Returns a welcome response from the server. | No            |

### Auth

| Method | Endpoint           | Description                               | Auth Required |
| ------ | ------------------ | ----------------------------------------- | ------------- |
| `POST` | `/api/auth/signup` | Register a new user.                      | No            |
| `POST` | `/api/auth/login`  | Login a user and receive an access token. | No            |

#### Signup Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

Allowed roles: `contributor`, `maintainer`.

#### Login Request Body

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Issues

| Method   | Endpoint          | Description                                     | Auth Required                  |
| -------- | ----------------- | ----------------------------------------------- | ------------------------------ |
| `POST`   | `/api/issues`     | Create a new issue.                             | Yes, contributor or maintainer |
| `GET`    | `/api/issues`     | Get all issues. Supports filtering and sorting. | No                             |
| `GET`    | `/api/issues/:id` | Get a single issue by ID.                       | No                             |
| `PATCH`  | `/api/issues/:id` | Update an issue.                                | Yes, contributor or maintainer |
| `DELETE` | `/api/issues/:id` | Delete an issue.                                | Yes, maintainer only           |

Use the JWT token from login in the `Authorization` header for protected routes.

```text
Authorization: <token>
```

#### Create Issue Request Body

```json
{
  "title": "Login button does not work",
  "description": "The login button does not submit the form when clicked.",
  "type": "bug"
}
```

Allowed issue types: `bug`, `feature_request`.

Issue descriptions must be at least 20 characters long.

#### Get Issues Query Parameters

| Query    | Allowed Values                    | Description                                         |
| -------- | --------------------------------- | --------------------------------------------------- |
| `type`   | `bug`, `feature_request`          | Filter issues by type.                              |
| `status` | `open`, `in_progress`, `resolved` | Filter issues by status.                            |
| `sort`   | `newest`, `oldest`                | Sort issues by creation date. Defaults to `newest`. |

Example:

```text
GET /api/issues?type=bug&status=open&sort=newest
```

#### Update Issue Request Body

```json
{
  "title": "Updated issue title",
  "description": "Updated issue description with enough details.",
  "type": "feature_request",
  "status": "in_progress"
}
```

Allowed statuses: `open`, `in_progress`, `resolved`.

Contributors can update only their own open issues and cannot update issue status. Maintainers can update issue status.

## Database Schema Summary

The application uses PostgreSQL and creates the following tables on startup if they do not already exist.

### users

| Column       | Type          | Notes                          |
| ------------ | ------------- | ------------------------------ |
| `id`         | `SERIAL`      | Primary key.                   |
| `name`       | `VARCHAR(30)` | User name.                     |
| `email`      | `VARCHAR(50)` | Unique and required.           |
| `password`   | `TEXT`        | Required hashed password.      |
| `role`       | `VARCHAR(15)` | Defaults to `contributor`.     |
| `created_at` | `TIMESTAMP`   | Defaults to current timestamp. |
| `updated_at` | `TIMESTAMP`   | Defaults to current timestamp. |

### issues

| Column        | Type           | Notes                             |
| ------------- | -------------- | --------------------------------- |
| `id`          | `SERIAL`       | Primary key.                      |
| `title`       | `VARCHAR(150)` | Required issue title.             |
| `description` | `TEXT`         | Issue details.                    |
| `type`        | `VARCHAR(20)`  | Required issue type.              |
| `status`      | `VARCHAR(20)`  | Defaults to `open`.               |
| `reporter_id` | `INTEGER`      | Required user ID of the reporter. |
| `created_at`  | `TIMESTAMP`    | Defaults to current timestamp.    |
| `updated_at`  | `TIMESTAMP`    | Defaults to current timestamp.    |

## Notes

- JWT access tokens expire after 7 days.
- Protected routes expect the raw token value in the `Authorization` header.
- CORS is currently configured for `http://localhost:5000`.
