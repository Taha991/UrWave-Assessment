USE ProductsCategoriesDB;
GO

-- Insert Categories
-- Ensure no duplicate categories are inserted
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Electronics')
BEGIN
    INSERT INTO Categories (Name, Description, ParentCategoryId, Status)
    VALUES ('Electronics', 'Devices and gadgets', NULL, 0);
END

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Books')
BEGIN
    INSERT INTO Categories (Name, Description, ParentCategoryId, Status)
    VALUES ('Books', 'All kinds of books', NULL, 0);
END

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Clothing')
BEGIN
    INSERT INTO Categories (Name, Description, ParentCategoryId, Status)
    VALUES ('Clothing', 'Apparel for men and women', NULL, 0);
END

-- Insert subcategories
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Smartphones')
BEGIN
    INSERT INTO Categories (Name, Description, ParentCategoryId, Status)
    VALUES ('Smartphones', 'Mobile phones and accessories', 
        (SELECT Id FROM Categories WHERE Name = 'Electronics'), 0);
END

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Fiction')
BEGIN
    INSERT INTO Categories (Name, Description, ParentCategoryId, Status)
    VALUES ('Fiction', 'Novels and fiction books', 
        (SELECT Id FROM Categories WHERE Name = 'Books'), 0);
END

-- Insert Products
-- Use proper error handling for NULL CategoryId
INSERT INTO Products (Name, Description, Price, CategoryId, Status, StockQuantity)
SELECT 'iPhone 13', 'Latest Apple iPhone', 999.99, Id, 0, 20
FROM Categories WHERE Name = 'Smartphones';

INSERT INTO Products (Name, Description, Price, CategoryId, Status, StockQuantity)
SELECT 'Samsung Galaxy S22', 'Flagship Samsung smartphone', 899.99, Id, 0, 15
FROM Categories WHERE Name = 'Smartphones';

INSERT INTO Products (Name, Description, Price, CategoryId, Status, StockQuantity)
SELECT 'Harry Potter', 'Fantasy novel', 19.99, Id, 0, 100
FROM Categories WHERE Name = 'Fiction';

INSERT INTO Products (Name, Description, Price, CategoryId, Status, StockQuantity)
SELECT 'T-Shirt', 'Cotton t-shirt', 9.99, Id, 0, 50
FROM Categories WHERE Name = 'Clothing';

INSERT INTO Products (Name, Description, Price, CategoryId, Status, StockQuantity)
SELECT 'Jeans', 'Denim jeans', 29.99, Id, 0, 40
FROM Categories WHERE Name = 'Clothing';

-- Insert ProductImages
-- Validate ProductId
INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary)
SELECT Id, 'https://example.com/iphone13.jpg', 1
FROM Products WHERE Name = 'iPhone 13';

INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary)
SELECT Id, 'https://example.com/galaxyS22.jpg', 1
FROM Products WHERE Name = 'Samsung Galaxy S22';

INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary)
SELECT Id, 'https://example.com/harrypotter.jpg', 1
FROM Products WHERE Name = 'Harry Potter';

INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary)
SELECT Id, 'https://example.com/tshirt.jpg', 1
FROM Products WHERE Name = 'T-Shirt';

INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary)
SELECT Id, 'https://example.com/jeans.jpg', 1
FROM Products WHERE Name = 'Jeans';

-- Insert Admin User
-- Use hashed password for admin user
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@email.com')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, Role) 
	-- password is 123456
    VALUES ('admin', 'admin@email.com', 'Abrjhc0X3/KsuFepxnQoEabEkrKTfY0guC5zxR7dOdl42wh4tTYGFClcCrqwVqaYg8A0YwxkU3CpinE2ke3bUA==', 'Admin');
END

-- Insert Activity Logs
-- Ensure UserId is valid
INSERT INTO ActivityLogs (Activity, UserId)
SELECT 'Initial database seeding completed', Id
FROM Users WHERE Email = 'admin@email.com';
GO







