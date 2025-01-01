
# README.md

## Project Overview

This repository contains the complete implementation for the Products and Categories Management System. The project includes both backend and frontend applications, along with database creation and seed data scripts.

## Features

- **Backend**: .NET API with endpoints for managing products, categories, and user authentication.
- **Frontend**: Angular application for managing products and categories with interactive features.
- **Database**: SQL Server database with tables for products, categories, users, and related data.
- **Authentication**: Login system with role-based redirection (Admin, Customer).

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
- For login issues, check the seeded user credentials in the database:
  - Admin credentials: `admin@email.com` / `123456`
- Verify the connection string in the backend project's `appsettings.json` matches your SQL Server setup.
