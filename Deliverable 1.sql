-- ==========================
--  TABLE CREATION
-- ==========================

-- 1️ Users Table
CREATE TABLE Users(
    UserID INT PRIMARY KEY NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    Username NVARCHAR(20) NOT NULL,
    Password NVARCHAR(16) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PhoneNum NVARCHAR(13) UNIQUE NOT NULL,
    Role NVARCHAR(10) CHECK (Role IN ('Customer','Admin','Staff')) NOT NULL,
    ProfilePic VARBINARY(MAX) NULL
);

-- 2️ Restaurants Table
CREATE TABLE Restaurants(
    RestaurantID INT PRIMARY KEY NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    PhoneNum NVARCHAR(13) UNIQUE NOT NULL,
    OperatingHoursStart TIME NOT NULL,
    OperatingHoursEnd TIME NOT NULL,
    Status NVARCHAR(10) CHECK (Status IN ('Open','Closed')) NOT NULL DEFAULT ('Open'),
    ProfilePic VARBINARY(MAX) NULL
);

-- 3️ RestaurantAdmins Table
CREATE TABLE RestaurantAdmins (
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (RestaurantID, UserID)
);

-- 3️.5 RestaurantStaff Table
CREATE TABLE RestaurantStaff (
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (RestaurantID, UserID)
);

-- 4️ Tables Table
CREATE TABLE Tables(
    TableID INT PRIMARY KEY NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity > 0),
    Status NVARCHAR(10) CHECK (Status IN ('Reserved','Free','Occupied')) NOT NULL DEFAULT ('Free'),
    Description NVARCHAR(MAX),
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 5️ Reservations Table
CREATE TABLE Reservations (
    ReservationID INT PRIMARY KEY NOT NULL,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    TableID INT FOREIGN KEY REFERENCES Tables(TableID) ON UPDATE CASCADE ON DELETE SET NULL,
    Time DATETIME DEFAULT GETDATE() NOT NULL,
    Duration INT NOT NULL CHECK (Duration > 0),
    People INT NOT NULL CHECK (People > 0),
    Request NVARCHAR(MAX),
    Status NVARCHAR(10) NOT NULL DEFAULT 'Pending' 
        CHECK (Status IN ('Pending', 'Approved', 'Completed', 'Cancelled'))
);

-- 6️ Reviews Table
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY NOT NULL,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE SET NULL,
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5) DEFAULT 1,
    Comment NVARCHAR(MAX) NULL
);

-- 7️ Cuisines Table
CREATE TABLE Cuisines(
    CuisineID INT PRIMARY KEY NOT NULL,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NOT NULL
);

-- 8️ User Preferred Restaurants Table
CREATE TABLE UserPrefRests(
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (UserID, RestaurantID)
);

-- 9️ User Preferred Cuisines Table
CREATE TABLE UserPrefCuisines(
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    CuisineID INT FOREIGN KEY REFERENCES Cuisines(CuisineID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (UserID, CuisineID)
);

-- 10 Restaurant Cuisines Table
CREATE TABLE RestCuisines(
    CuisineID INT FOREIGN KEY REFERENCES Cuisines(CuisineID) ON UPDATE CASCADE ON DELETE CASCADE,
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (CuisineID, RestaurantID)
);

-- 1️1 Restaurant Images Table
CREATE TABLE RestImages(
    ImageID INT PRIMARY KEY NOT NULL,
    RestaurantID INT FOREIGN KEY REFERENCES Restaurants(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    Image VARBINARY(MAX) NULL
);

-- 1️2 Payments Table
CREATE TABLE Payments(
    PaymentID INT PRIMARY KEY NOT NULL,
    ReservationID INT FOREIGN KEY REFERENCES Reservations(ReservationID) ON UPDATE CASCADE ON DELETE SET NULL,
    Amount INT NOT NULL CHECK (Amount > 0),
    PaymentDate DATETIME DEFAULT GETDATE() NOT NULL,
    Status NVARCHAR(10) NOT NULL CHECK (Status IN ('Pending', 'Completed', 'Failed')),
    Method NVARCHAR(10) NOT NULL CHECK (Method IN ('Cash', 'Card'))
);

-- ==========================
--  INSERT DUMMY DATA
-- ==========================

-- 1️ Insert Users
INSERT INTO Users (UserID, Name, Username, Password, Email, PhoneNum, Role, ProfilePic)
VALUES 
(1, 'Ali Khan', 'ali123', 'password1', 'ali@example.com', '03001234567', 'Customer', NULL),
(2, 'Sara Ahmed', 'sara456', 'password2', 'sara@example.com', '03019876543', 'Admin', NULL),
(3, 'Omar Sheikh', 'omar789', 'password3', 'omar@example.com', '03121234567', 'Staff', NULL);

-- 2️ Insert Restaurants
INSERT INTO Restaurants (RestaurantID, Name, Description, Location, PhoneNum, OperatingHoursStart, OperatingHoursEnd, Status, ProfilePic)
VALUES 
(1, 'La Pinoz', 'Italian Cuisine', 'Karachi, Pakistan', '02134567890', '12:00:00', '23:00:00', 'Open', NULL),
(2, 'BBQ Tonight', 'Traditional BBQ', 'Lahore, Pakistan', '02187654321', '11:00:00', '22:00:00', 'Open', NULL);

-- 3️ Insert RestaurantAdmins
INSERT INTO RestaurantAdmins (RestaurantID, UserID) VALUES (1, 2), (2, 2);

-- 3️.5 Insert RestaurantStaff
INSERT INTO RestaurantStaff (RestaurantID, UserID) VALUES (1, 1), (2, 3);

-- 4️ Insert Tables
INSERT INTO Tables (TableID, Capacity, Status, Description, RestaurantID)
VALUES (1, 4, 'Free', 'Near window', 1), (2, 6, 'Reserved', 'Private booth', 1), (3, 2, 'Occupied', 'Outdoor table', 2);

-- 5️ Insert Reservations
INSERT INTO Reservations (ReservationID, UserID, TableID, Time, Duration, People, Request, Status)
VALUES (1, 1, 1, '2025-03-29 19:00:00', 90, 2, 'Window seat preferred', 'Approved');

-- 6️ Insert Reviews
INSERT INTO Reviews (ReviewID, UserID, RestaurantID, Rating, Comment)
VALUES (1, 1, 1, 5, 'Amazing food and service!'), (2, 1, 2, 4, 'Great BBQ, but a bit crowded.');

-- 7️ Insert Cuisines
INSERT INTO Cuisines (CuisineID, Name, Description)
VALUES (1, 'Italian', 'Pizza, Pasta, and more'), (2, 'BBQ', 'Traditional grilled meats');

-- 8️ Insert User Preferences for Restaurants
INSERT INTO UserPrefRests (UserID, RestaurantID) VALUES (1, 1), (1, 2);

-- 9️ Insert User Preferences for Cuisines
INSERT INTO UserPrefCuisines (UserID, CuisineID) VALUES (1, 1), (1, 2);

-- 10 Insert Restaurant Cuisines
INSERT INTO RestCuisines (CuisineID, RestaurantID) VALUES (1, 1), (2, 2);

-- 1️1 Insert Restaurant Images
INSERT INTO RestImages (ImageID, RestaurantID, Image) VALUES (1, 1, NULL), (2, 2, NULL);

-- 1️2 Insert Payments
INSERT INTO Payments (PaymentID, ReservationID, Amount, PaymentDate, Status, Method)
VALUES (1, 1, 3000, '2025-03-29 18:30:00', 'Completed', 'Card');
