
## Project Overview

This repository contains the complete implementation of the Products and Categories Management System using Onion Architecture. The project ensures separation of concerns, scalability, and maintainability. It includes both backend and frontend applications, with secure authentication and role-based access control (RBAC).

## Features

### Backend
- **Architecture**: Onion Architecture for clean separation of concerns.
- **Authentication**: JWT-based authentication with refresh token support.
- **Authorization**: Role-based access control (Admin, Customer) with middleware for role validation.
- **Product Management**:
  - Server-side pagination.
  - Filtering by category, price range, and status.
  - Custom sorting options.
  - Inline editing for quick updates.
- **Category Management**:
  - Hierarchical structure support.
  - CRUD operations with relationship handling.
  - Product reassignment on category deletion.
- **Error Handling**: Centralized error handling with detailed responses.
- **Caching**: Basic caching for frequently accessed data.

### Frontend
- **Framework**: Angular 18+ with standalone components.
- **State Management**: Signal-based state management for real-time updates.
- **UI Components**: Built using PrimeNG components.
- **Responsive Design**: Styled with TailwindCSS for consistent and responsive design.
- **Role-based Redirection**: Conditional navigation based on user roles.

### Database
- SQL Server with tables for products, categories, users, roles, and logs.

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your system:

- SQL Server (Express or Developer Edition)
- .NET SDK (version 8 or higher)
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Repository

Clone the repository:

```bash
git clone https://github.com/Taha991/UrWave-Assessment.git
cd UrWave-Assessment
```

### Database Setup

#### Step 1: Create the Database

Navigate to the database folder and execute the `ProductsCategoriesDB_Setup.sql` script in SQL Server Management Studio (SSMS):

```sql
USE master;
GO
-- Execute the script inside the database folder
-- ProductsCategoriesDB_Setup.sql
```

#### Step 2: Seed Initial Data

After creating the database, seed it with initial data:

```sql
USE ProductsCategoriesDB;
GO
-- Execute the SeedData.sql script
-- This will populate the database with mock data for categories, products, and users.
```

### Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Restore dependencies and build the project:

```bash
dotnet restore
dotnet build
```

Run the backend server:

```bash
dotnet run
```

The API will be available at `https://localhost:7024`.

#### Configuration

Update the connection string in `appsettings.json` to match your SQL Server setup. Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ProductsCategoriesDB;Trusted_Connection=True;"
}
```

### Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Angular application:

```bash
ng serve
```

The frontend will be available at `http://localhost:4200`.

### Test the Application

1. Open your browser and navigate to the frontend URL: `http://localhost:4200`.
2. Login using the provided admin credentials:
   - **Email**: `admin@email.com`
   - **Password**: `123456`

### Roles and Permissions

| Role      | Permissions                              |
|-----------|------------------------------------------|
| Admin     | Full access to products, categories, and user management. |
| Customer  | View products and categories.           |

## Files and Directories

- **backend**: Contains the .NET API source code.
- **frontend**: Contains the Angular application source code.
- **database**: SQL scripts for database creation and seeding.
  - `ProductsCategoriesDB_Setup.sql`: Creates the database schema.
  - `SeedData.sql`: Seeds mock data for testing.

## Submission

Submit the following details as per the requirements:

- **Repository**: Include this GitHub repository URL: `https://github.com/Taha991/UrWave-Assessment`
- **Email Address**: Provide your email address in the submission form.
- **Form**: Submit the repository and email via the form link: [Submit Here](#)

## Additional Notes

- Ensure the backend and frontend are running simultaneously to test all features.
- For login issues, check the seeded user credentials in the database.
- Validate that server-side pagination is functional by testing endpoints with query parameters.
- Review and test role-based restrictions for Admin and Customer users.

## Key Enhancements

1. **Onion Architecture**: Provides separation of concerns through layers for Core, Application, Infrastructure, and API.
2. **JWT Authentication**: Secure user authentication with token-based mechanism.
3. **Server-Side Pagination**: Efficient data handling for large datasets.
4. **Role-Based Access Control**: Enhanced security and tailored user experiences.

