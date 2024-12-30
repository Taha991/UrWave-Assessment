CREATE DATABASE ProductsCategoriesDB;
GO

USE ProductsCategoriesDB;
GO

CREATE TABLE Categories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    ParentCategoryId UNIQUEIDENTIFIER NULL,
    Status INT NOT NULL, -- 0: Active, 1: Inactive
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Categories_ParentCategory FOREIGN KEY (ParentCategoryId) REFERENCES Categories(Id)
);
GO

CREATE INDEX IDX_Categories_ParentCategoryId ON Categories(ParentCategoryId);

CREATE TABLE Products (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL CHECK (Price > 0),
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    Status INT NOT NULL, -- 0: Active, 1: Inactive, 2: Discontinued
    StockQuantity INT NOT NULL CHECK (StockQuantity >= 0),
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);
GO

-- Index for CategoryId to optimize filtering by category
CREATE INDEX IDX_Products_CategoryId ON Products(CategoryId);

-- Index for Status and StockQuantity for filtering and alerts
CREATE INDEX IDX_Products_Status ON Products(Status);
CREATE INDEX IDX_Products_StockQuantity ON Products(StockQuantity);

CREATE TABLE ProductImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProductId UNIQUEIDENTIFIER NOT NULL,
    ImageUrl NVARCHAR(1000) NOT NULL, -- URL to the image
    IsPrimary BIT DEFAULT 0, -- Indicates if this is the primary image
    CreatedDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
GO

-- Index for ProductId to optimize joins with Products
CREATE INDEX IDX_ProductImages_ProductId ON ProductImages(ProductId);

-- Index for IsPrimary to optimize retrieval of primary images
CREATE INDEX IDX_ProductImages_IsPrimary ON ProductImages(ProductId, IsPrimary);

CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TableName NVARCHAR(100) NOT NULL,
    Operation NVARCHAR(50) NOT NULL, -- e.g., INSERT, UPDATE, DELETE
    RecordId UNIQUEIDENTIFIER NOT NULL,
    UserId NVARCHAR(100),
    Timestamp DATETIME DEFAULT GETDATE(),
    OldValues NVARCHAR(MAX),
    NewValues NVARCHAR(MAX)
);
GO

CREATE INDEX IDX_AuditLogs_TableName ON AuditLogs(TableName);
CREATE INDEX IDX_AuditLogs_Timestamp ON AuditLogs(Timestamp);

CREATE TABLE ActivityLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Activity NVARCHAR(200) NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE(),
    UserId UNIQUEIDENTIFIER NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO

-- Index for Timestamp to optimize recent activity queries
CREATE INDEX IDX_ActivityLogs_Timestamp ON ActivityLogs(Timestamp);

CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(20) NOT NULL, -- e.g., Admin, Viewer
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Index for Username to optimize authentication
CREATE INDEX IDX_Users_Username ON Users(Username);
