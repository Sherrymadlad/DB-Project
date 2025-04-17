--Users

--Select all Users
Select * from Users

--Select a specific User
Select * from  Users
where UserID=@Userid

--Register User
CREATE PROCEDURE RegisterUser
	@UserID int,
    @Name NVARCHAR(50),
    @Username NVARCHAR(20),
    @Password NVARCHAR(16),
    @Email NVARCHAR(100),
    @PhoneNum NVARCHAR(13),
    @Role NVARCHAR(10)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE UserID=@UserID OR Username = @Username OR Email = @Email OR PhoneNum = @PhoneNum)
    BEGIN
        RAISERROR ('User already exists with this id, email, username, or phone number.', 16, 1);
        RETURN;
    END

    INSERT INTO Users (UserID, Name, Username, Password, Email, PhoneNum, Role) 
    VALUES (@UserID, @Name, @Username, @Password, @Email, @PhoneNum, @Role);
END;

--Delete User
CREATE PROCEDURE DeleteUser
	@UserID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    DELETE FROM Users WHERE UserID = @UserID;
END;

--Update User Information
CREATE PROCEDURE UpdateUser
    @UserID INT,
    @Name NVARCHAR(50) = NULL,
    @Username NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @PhoneNum NVARCHAR(13) = NULL
AS
BEGIN
    -- Check if the user exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    -- Check if the new username is unique (excluding the current user)
    IF @Username IS NOT NULL AND EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND UserID <> @UserID)
    BEGIN
        RAISERROR ('Username already exists.', 16, 1);
        RETURN;
    END

    -- Check if the new email is unique (excluding the current user)
    IF @Email IS NOT NULL AND EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND UserID <> @UserID)
    BEGIN
        RAISERROR ('Email already exists.', 16, 1);
        RETURN;
    END

    -- Check if the new phone number is unique (excluding the current user)
    IF @PhoneNum IS NOT NULL AND EXISTS (SELECT 1 FROM Users WHERE PhoneNum = @PhoneNum AND UserID <> @UserID)
    BEGIN
        RAISERROR ('Phone number already exists.', 16, 1);
        RETURN;
    END

    -- Perform the update
    UPDATE Users
    SET 
        Name = COALESCE(@Name, Name),
        Username = COALESCE(@Username, Username),
        Email = COALESCE(@Email, Email),
        PhoneNum = COALESCE(@PhoneNum, PhoneNum)
    WHERE UserID = @UserID;
END;

--Retrieve by role
SELECT * FROM Users WHERE Role = @Role;

--Authenticate User
CREATE PROCEDURE AuthenticateUser
    @Username NVARCHAR(20),
    @Password NVARCHAR(16)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND Password = @Password)
        SELECT 'Login Successful' AS Message;
    ELSE
        RAISERROR ('Invalid Username or Password.', 16, 1);
END;

--Change Password
CREATE PROCEDURE ChangePassword
    @UserID INT,
    @OldPassword NVARCHAR(16),
    @NewPassword NVARCHAR(16)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Password = @OldPassword)
    BEGIN
        RAISERROR ('Old password is incorrect or user not found.', 16, 1);
        RETURN;
    END

    UPDATE Users SET Password = @NewPassword WHERE UserID = @UserID;
END;

--Get User Reservations
CREATE PROCEDURE GetUserReservations
    @UserID INT
AS
BEGIN
    SELECT *
    FROM Reservations
    WHERE UserID = @UserID;
END;

--Get User Reviews
CREATE PROCEDURE GetUserReviews
    @UserID INT
AS
BEGIN
    SELECT *
    FROM Reviews 
    WHERE UserID = @UserID;
END;

--Get My Restaurants (Admin)
Select * from Restaurants
join RestaurantAdmins on Restaurants.RestaurantID=RestaurantAdmins.RestaurantID
where RestaurantAdmins.UserID=@Userid

--Get Cuisine Prefs
Select Name from Cuisines
join UserPrefCuisines on Cuisines.CuisineID=UserPrefCuisines.CuisineID
where UserID=@Userid

--Add Cuisine Prefs
CREATE PROCEDURE AddUserCuisinePreference
    @UserID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if the preference already exists
    IF EXISTS (SELECT 1 FROM UserPrefCuisines WHERE UserID = @UserID AND CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('User already has this cuisine preference.', 16, 1);
        RETURN;
    END

    -- Insert the new preference
    INSERT INTO UserPrefCuisines (UserID, CuisineID) 
    VALUES (@UserID, @CuisineID);
END;

--Delete Cuisine Prefs
CREATE PROCEDURE RemoveUserCuisinePreference
    @UserID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if the user has this cuisine preference
    IF NOT EXISTS (SELECT 1 FROM UserPrefCuisines WHERE UserID = @UserID AND CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('User does not have this cuisine preference.', 16, 1);
        RETURN;
    END

    -- Delete the specific cuisine preference
    DELETE FROM UserPrefCuisines WHERE UserID = @UserID AND CuisineID = @CuisineID;
END;

--Get Users Preference of restaurants
SELECT Name FROM Restaurants
JOIN UserPrefRests ON Restaurants.RestaurantID = UserPrefRests.RestaurantID
WHERE UserPrefRests.UserID = @Userid;

--Add user restaurant perference
CREATE PROCEDURE AddUserRestaurantPreference
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
    -- Check if the preference already exists
    IF EXISTS (SELECT 1 FROM UserPrefRests WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('User already has this restaurant preference.', 16, 1);
        RETURN;
    END

    -- Insert the new preference
    INSERT INTO UserPrefRests (UserID, RestaurantID) 
    VALUES (@UserID, @RestaurantID);
END;

--Delete user restaurant preferences
CREATE PROCEDURE RemoveUserRestaurantPreference
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
    -- Check if the user has this restaurant preference
    IF NOT EXISTS (SELECT 1 FROM UserPrefRests WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('User does not have this restaurant preference.', 16, 1);
        RETURN;
    END

    -- Delete the specific restaurant preference
    DELETE FROM UserPrefRests WHERE UserID = @UserID AND RestaurantID = @RestaurantID;
END;


--Restaurants

--Get all restaurants
SELECT * FROM Restaurants;

--Get a specific restaurant
SELECT * FROM Restaurants WHERE RestaurantID = @RestaurantID;

--Register new restaurant 
CREATE PROCEDURE RegisterRestaurant
    @UserID INT,
    @RestaurantID INT,
    @Name NVARCHAR(50),
    @Description NVARCHAR(MAX),
    @Location NVARCHAR(100),
    @PhoneNum NVARCHAR(13),
    @OperatingHoursStart TIME,
    @OperatingHoursEnd TIME,
    @ProfilePic VARBINARY(MAX) = NULL
AS
BEGIN
    -- Check if the user is an Admin
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        RAISERROR ('Only admins can register a new restaurant.', 16, 1);
        RETURN;
    END

    -- Check if a restaurant already exists with the same ID
    IF EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('A restaurant with this ID already exists.', 16, 1);
        RETURN;
    END

    -- Insert the new restaurant
    INSERT INTO Restaurants (RestaurantID, Name, Description, Location, PhoneNum, OperatingHoursStart, OperatingHoursEnd, ProfilePic)
    VALUES (@RestaurantID, @Name, @Description, @Location, @PhoneNum, @OperatingHoursStart, @OperatingHoursEnd, @ProfilePic);
END;

--Update restaurant info
CREATE PROCEDURE UpdateRestaurant
    @UserID INT,  -- Pass UserID to check role
    @RestaurantID INT,
    @Name NVARCHAR(50) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @Location NVARCHAR(100) = NULL,
    @PhoneNum NVARCHAR(13) = NULL,
    @OperatingHoursStart TIME = NULL,
    @OperatingHoursEnd TIME = NULL,
    @Status NVARCHAR(10) = NULL,
    @ProfilePic VARBINARY(MAX) = NULL
AS
BEGIN
    -- Check if restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant not found.', 16, 1);
        RETURN;
    END

    -- Check if user is an Admin or Staff of the specific restaurant
    IF EXISTS (SELECT 1 FROM RestaurantAdmins WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        -- Admin can update everything
        UPDATE Restaurants
        SET 
            Name = COALESCE(@Name, Name),
            Description = COALESCE(@Description, Description),
            Location = COALESCE(@Location, Location),
            PhoneNum = COALESCE(@PhoneNum, PhoneNum),
            OperatingHoursStart = COALESCE(@OperatingHoursStart, OperatingHoursStart),
            OperatingHoursEnd = COALESCE(@OperatingHoursEnd, OperatingHoursEnd),
            Status = COALESCE(@Status, Status),
            ProfilePic = COALESCE(@ProfilePic, ProfilePic)
        WHERE RestaurantID = @RestaurantID;
        RETURN;
    END

    -- If user is a Staff, only allow update of operating hours and status
    IF EXISTS (SELECT 1 FROM RestaurantStaff WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        UPDATE Restaurants
        SET 
            OperatingHoursStart = COALESCE(@OperatingHoursStart, OperatingHoursStart),
            OperatingHoursEnd = COALESCE(@OperatingHoursEnd, OperatingHoursEnd),
            Status = COALESCE(@Status, Status)
        WHERE RestaurantID = @RestaurantID;
        RETURN;
    END

    -- If the user is not an Admin or Staff for this restaurant, raise an error
    RAISERROR ('Unauthorized action.', 16, 1);
END;

--Delete a restaurant
CREATE PROCEDURE DeleteRestaurant
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
    -- Check if the user is an Admin of the specific restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Only admins of the restaurant can delete it.', 16, 1);
        RETURN;
    END

    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant not found.', 16, 1);
        RETURN;
    END

    -- Delete the restaurant
    DELETE FROM Restaurants WHERE RestaurantID = @RestaurantID;
END;

--Retrieve restaurants by their status
CREATE PROCEDURE GetRestaurantsByStatus
    @Status NVARCHAR(10)
AS
BEGIN
    SELECT * FROM Restaurants WHERE Status = @Status;
END;

--Retrieve them by the cuisine(s) they're offering
CREATE PROCEDURE GetRestaurantsByCuisine
    @CuisineID INT
AS
BEGIN
    SELECT R.*
    FROM Restaurants R
    JOIN RestCuisines RC ON R.RestaurantID = RC.RestaurantID
    WHERE RC.CuisineID = @CuisineID;
END;

--Assign admin to a restaurant
CREATE PROCEDURE AssignRestaurantAdmin
    @RestaurantID INT,
    @UserID INT,          -- The user requesting the action
    @TargetUserID INT     -- The user being assigned as admin
AS
BEGIN
    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR ('Only an admin of this specific restaurant can assign another admin.', 16, 1);
        RETURN;
    END

    -- Check if the targeted user (@TargetUserID) is already an admin of the restaurant
    IF EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID)
    BEGIN
        RAISERROR ('Target user is already an admin of this restaurant.', 16, 1);
        RETURN;
    END

    -- Check if the targeted user exists and is an admin
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @TargetUserID AND Role = 'Admin')
    BEGIN
        RAISERROR ('Target user must be an Admin to be assigned as a restaurant admin.', 16, 1);
        RETURN;
    END

    -- Assign the target user as admin for the restaurant
    INSERT INTO RestaurantAdmins (RestaurantID, UserID)
    VALUES (@RestaurantID, @TargetUserID);
END;

--Remove admin from restaurant
CREATE PROCEDURE RemoveRestaurantAdmin
    @UserID INT,          -- The user making the request
    @TargetUserID INT,    -- The admin being removed
    @RestaurantID INT
AS
BEGIN
    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR ('Only an admin of this specific restaurant can remove another admin.', 16, 1);
        RETURN;
    END

    -- Check if the target user (@TargetUserID) is an admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID)
    BEGIN
        RAISERROR ('Target user is not an admin of this restaurant.', 16, 1);
        RETURN;
    END

    -- Remove the admin from RestaurantAdmins
    DELETE FROM RestaurantAdmins  
    WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID;
END;

--All admins for a specfic restaurant
SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
FROM Users U  
JOIN RestaurantAdmins RA ON U.UserID = RA.UserID  
WHERE RA.RestaurantID = @Restaurantid;  

-- Assign staff to a restaurant
CREATE PROCEDURE AssignRestaurantStaff
    @RestaurantID INT,
    @UserID INT,          -- The user requesting the action
    @TargetUserID INT     -- The user being assigned as staff
AS
BEGIN
    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR ('Only an admin of this specific restaurant can assign staff.', 16, 1);
        RETURN;
    END

	-- Check if the targeted user exists and is a staff
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @TargetUserID AND Role = 'Staff')
    BEGIN
        RAISERROR ('Target user must be a staff member to be assigned as a restaurant staff member.', 16, 1);
        RETURN;
    END

    -- Check if the targeted user (@TargetUserID) is already a staff of the restaurant
    IF EXISTS (SELECT 1 FROM RestaurantStaff WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID)
    BEGIN
        RAISERROR ('Target user is already a staff member of this restaurant.', 16, 1);
        RETURN;
    END

    -- Assign the target user as staff for the restaurant
    INSERT INTO RestaurantStaff (RestaurantID, UserID)
    VALUES (@RestaurantID, @TargetUserID);
END;

-- Remove staff from restaurant
CREATE PROCEDURE RemoveRestaurantStaff
    @UserID INT,          -- The user making the request
    @TargetUserID INT,    -- The staff being removed
    @RestaurantID INT
AS
BEGIN
    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR ('Only an admin of this specific restaurant can remove staff.', 16, 1);
        RETURN;
    END

    -- Check if the target user (@TargetUserID) is a staff of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantStaff WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID)
    BEGIN
        RAISERROR ('Target user is not a staff member of this restaurant.', 16, 1);
        RETURN;
    END

    -- Remove the staff from RestaurantStaff
    DELETE FROM RestaurantStaff  
    WHERE RestaurantID = @RestaurantID AND UserID = @TargetUserID;
END;

-- All staff for a specific restaurant
SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
FROM Users U  
JOIN RestaurantStaff RS ON U.UserID = RS.UserID  
WHERE RS.RestaurantID = @RestaurantID;

--Add Rest Image
CREATE PROCEDURE AddRestaurantImage
    @RestaurantID INT,
    @Image VARBINARY(MAX),
    @UserID INT  -- The user requesting the action
AS
BEGIN
    -- Check if the user is an admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR('Only an admin of this restaurant can add images.', 16, 1);
        RETURN;
    END

    -- Add the image to the restaurant
    INSERT INTO RestImages (RestaurantID, Image)
    VALUES (@RestaurantID, @Image);
END;

--Delete Rest Image
CREATE PROCEDURE DeleteRestaurantImage
    @ImageID INT,
    @RestaurantID INT,
    @UserID INT  -- The user requesting the action
AS
BEGIN
    -- Check if the user is an admin of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR('Only an admin of this restaurant can delete images.', 16, 1);
        RETURN;
    END

    -- Delete the image
    DELETE FROM RestImages
    WHERE ImageID = @ImageID AND RestaurantID = @RestaurantID;
END;

--View Rest Images
Select Image from RestImages
where RestaurantID=@RestaurantID;


--Tables

--Get all tables in a restaurant
SELECT * FROM Tables WHERE RestaurantID = @Restaurantid

--Check table availability
CREATE PROCEDURE CheckTableAvailability
    @TableID INT
AS
BEGIN
    SELECT Status FROM Tables WHERE TableID = @TableID;
END;

--Insert a table for a restaurant
CREATE PROCEDURE AddTable
    @UserID INT,          -- The user making the request
    @TableID INT,
    @Capacity INT,
    @Description NVARCHAR(MAX),
    @RestaurantID INT
AS
BEGIN
    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (
        SELECT 1 FROM RestaurantAdmins 
        WHERE UserID = @UserID AND RestaurantID = @RestaurantID
    )
    BEGIN
        RAISERROR ('Only admins can add tables.', 16, 1);
        RETURN;
    END

    -- Insert the new table into the Tables table
    INSERT INTO Tables (TableID, Capacity, Description, RestaurantID)
    VALUES (@TableID, @Capacity, @Description, @RestaurantID);
END;


--Update table information
CREATE PROCEDURE UpdateTable
    @UserID INT,         -- The user making the request
    @TableID INT,
    @Capacity INT = NULL,
    @Status NVARCHAR(10) = NULL,
    @Description NVARCHAR(MAX) = NULL
AS
BEGIN
    DECLARE @RestaurantID INT;
    
    -- Get the RestaurantID for the given TableID
    SELECT @RestaurantID = RestaurantID FROM Tables WHERE TableID = @TableID;

    -- If no table found, return an error
    IF @RestaurantID IS NULL
    BEGIN
        RAISERROR ('Table not found.', 16, 1);
        RETURN;
    END

    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (
        SELECT 1 FROM RestaurantAdmins 
        WHERE UserID = @UserID AND RestaurantID = @RestaurantID
    )
    BEGIN
        RAISERROR ('Only admins can update tables.', 16, 1);
        RETURN;
    END

    -- Proceed with the update
    UPDATE Tables
    SET 
        Capacity = COALESCE(@Capacity, Capacity),
        Status = COALESCE(@Status, Status),
        Description = COALESCE(@Description, Description)
    WHERE TableID = @TableID;
END;


--Delete table 
CREATE PROCEDURE DeleteTable
    @UserID INT,         -- The user making the request
    @TableID INT
AS
BEGIN
    DECLARE @RestaurantID INT;
    
    -- Get the RestaurantID for the given TableID
    SELECT @RestaurantID = RestaurantID FROM Tables WHERE TableID = @TableID;

    -- If no table found, return an error
    IF @RestaurantID IS NULL
    BEGIN
        RAISERROR ('Table not found.', 16, 1);
        RETURN;
    END

    -- Check if the requester (@UserID) is an Admin of the restaurant
    IF NOT EXISTS (
        SELECT 1 FROM RestaurantAdmins 
        WHERE UserID = @UserID AND RestaurantID = @RestaurantID
    )
    BEGIN
        RAISERROR ('Only admins can delete tables.', 16, 1);
        RETURN;
    END

    -- Proceed with the deletion
    DELETE FROM Tables WHERE TableID = @TableID;
END;

--Change table availability (manual by staff)
CREATE PROCEDURE UpdateTableStatus
    @UserID INT,           -- The staff member making the request
    @TableID INT,
    @NewStatus NVARCHAR(10) -- The new status to set
AS
BEGIN
    -- Check if the user is a staff member of the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantStaff WHERE UserID = @UserID AND RestaurantID IN (SELECT RestaurantID FROM Tables WHERE TableID = @TableID))
    BEGIN
        RAISERROR ('Only staff members of the restaurant can change the table status.', 16, 1);
        RETURN;
    END

	-- Validate that the new status is one of the allowed values ('Reserved', 'Free', 'Occupied')
    IF @NewStatus NOT IN ('Reserved', 'Free', 'Occupied')
    BEGIN
        RAISERROR ('Invalid table status. The status must be one of the following: Reserved, Free, Occupied.', 16, 1);
        RETURN;
    END

    -- Update table status
    UPDATE Tables
    SET Status = @NewStatus
    WHERE TableID = @TableID;
END;


--Find available tables
CREATE PROCEDURE GetAvailableTables
    @RestaurantID INT
AS
BEGIN
    SELECT * FROM Tables
    WHERE RestaurantID = @RestaurantID
    AND Status = 'Free';
END;

--Find table by your desired table size
CREATE PROCEDURE GetTablesByCapacity
    @RestaurantID INT,
    @MinCapacity INT
AS
BEGIN
    SELECT * FROM Tables
    WHERE RestaurantID = @RestaurantID
    AND Capacity >= @MinCapacity
    AND Status = 'Free';
END;

--Reset tables at closing time (when the restaurant's gonna close, it sets all tables status to free for the next day)
CREATE PROCEDURE ResetTablesAtClosing
    @RestaurantID INT
AS
BEGIN
    DECLARE @ClosingTime TIME;

    -- Get the restaurant's closing time
    SELECT @ClosingTime = OperatingHoursEnd
    FROM Restaurants
    WHERE RestaurantID = @RestaurantID;

    -- Check if the current time is past the closing time
    IF (CAST(GETDATE() AS TIME) > @ClosingTime)
    BEGIN
        UPDATE Tables
        SET Status = 'Free'
        WHERE RestaurantID = @RestaurantID
        AND Status = 'Occupied';
    END;
END;

--Reservations

--Add reservation
CREATE PROCEDURE AddReservation(
    @UserID INT,
    @TableID INT,
    @Time DATETIME,
    @Duration INT,
    @People INT,
    @Request NVARCHAR(MAX)
)
AS
BEGIN
    INSERT INTO Reservations (UserID, TableID, Time, Duration, People, Request, Status)
    VALUES (@UserID, @TableID, @Time, @Duration, @People, @Request, 'Pending');
END;

--Update reservation details
CREATE PROCEDURE ModifyReservation
    @ReservationID INT,
    @UserID INT,            -- User requesting the modification
    @NewTime DATETIME = NULL,
    @NewDuration INT = NULL,
    @NewPeople INT = NULL,
    @NewRequest NVARCHAR(MAX) = NULL
AS
BEGIN
    DECLARE @RestaurantID INT, @ReservationUserID INT, @ReservationStatus NVARCHAR(10);

    -- Get the RestaurantID of the table associated with the reservation and the reservation's current status
    SELECT T.RestaurantID, R.UserID, R.Status
    INTO @RestaurantID, @ReservationUserID, @ReservationStatus
    FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE R.ReservationID = @ReservationID;

    -- Check if the user is the one who made the reservation
    IF @UserID != @ReservationUserID
    BEGIN
        -- If the user is not the reservation creator, check if they are a staff member
        IF NOT EXISTS (SELECT 1 FROM RestaurantStaff RS WHERE RS.RestaurantID = @RestaurantID AND RS.UserID = @UserID)
        BEGIN
            RAISERROR ('You do not have permission to modify this reservation.', 16, 1);
            RETURN;
        END
    END

    -- If the reservation is approved, change its status to 'Pending' upon modification
    IF @ReservationStatus = 'Approved'
    BEGIN
        UPDATE Reservations
        SET Status = 'Pending'
        WHERE ReservationID = @ReservationID;
    END

    -- Modify the reservation
    UPDATE Reservations
    SET 
        Time = COALESCE(@NewTime, Time),
        Duration = COALESCE(@NewDuration, Duration),
        People = COALESCE(@NewPeople, People),
        Request = COALESCE(@NewRequest, Request)
    WHERE ReservationID = @ReservationID 
    AND Status IN ('Pending');  -- Only allow modification if the reservation is in 'Pending' status
END;

--Cancel a Reservation
CREATE PROCEDURE CancelReservation
    @ReservationID INT,
    @UserID INT   -- User requesting the cancellation
AS
BEGIN
    DECLARE @RestaurantID INT, @ReservationUserID INT;

    -- Get the RestaurantID of the table associated with the reservation
    SELECT T.RestaurantID, R.UserID
    INTO @RestaurantID, @ReservationUserID
    FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE R.ReservationID = @ReservationID;

    -- Check if the user is the one who made the reservation or if they are a staff member
    IF @UserID != @ReservationUserID
    BEGIN
        -- Check if the user is a staff member of the restaurant
        IF NOT EXISTS (SELECT 1 FROM RestaurantStaff RS WHERE RS.RestaurantID = @RestaurantID AND RS.UserID = @UserID)
        BEGIN
            RAISERROR ('You do not have permission to cancel this reservation.', 16, 1);
            RETURN;
        END
    END

    -- Cancel the reservation if it's either Pending or Approved
    UPDATE Reservations
    SET Status = 'Cancelled'
    WHERE ReservationID = @ReservationID AND Status IN ('Pending', 'Approved');
END;

--Approve a Reservation
CREATE PROCEDURE ApproveReservation
    @ReservationID INT,
    @UserID INT          -- User requesting the approval (staff member)
AS
BEGIN
    DECLARE @RestaurantID INT, @TableID INT;

    -- Get the RestaurantID and TableID for the reservation
    SELECT @RestaurantID = T.RestaurantID, @TableID = R.TableID
    FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE R.ReservationID = @ReservationID;

    -- Check if the user is a staff member of the same restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantStaff RS WHERE RS.RestaurantID = @RestaurantID AND RS.UserID = @UserID)
    BEGIN
        RAISERROR ('Only staff members of the restaurant can approve the reservation.', 16, 1);
        RETURN;
    END

    -- Ensure the reservation is in "Pending" status before approving
    IF NOT EXISTS (SELECT 1 FROM Reservations WHERE ReservationID = @ReservationID AND Status = 'Pending')
    BEGIN
        RAISERROR ('The reservation is not in Pending status.', 16, 1);
        RETURN;
    END

    -- Update the reservation status to 'Approved'
    UPDATE Reservations
    SET Status = 'Approved'
    WHERE ReservationID = @ReservationID;

    -- Change the table status to 'Reserved'
    UPDATE Tables
    SET Status = 'Reserved'
    WHERE TableID = @TableID;
END;

--Complete a reservation
CREATE PROCEDURE CompleteReservation
    @ReservationID INT,
    @UserID INT           -- The staff member completing the reservation
AS
BEGIN
    DECLARE @RestaurantID INT, @ReservationUserID INT;
    
    -- Get the restaurant ID from the table associated with the reservation
    SELECT T.RestaurantID, R.UserID
    INTO @RestaurantID, @ReservationUserID
    FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE R.ReservationID = @ReservationID;

    -- Check if the user is the reservation creator or a staff member at the same restaurant
    IF @UserID != @ReservationUserID
    BEGIN
        -- Check if the user is a staff member of the same restaurant
        IF NOT EXISTS (SELECT 1 FROM RestaurantStaff RS WHERE RS.RestaurantID = @RestaurantID AND RS.UserID = @UserID)
        BEGIN
            RAISERROR('You do not have permission to complete this reservation.', 16, 1);
            RETURN;
        END
    END

    -- Only update if the reservation status is 'Approved'
    IF EXISTS (SELECT 1 FROM Reservations WHERE ReservationID = @ReservationID AND Status = 'Approved')
    BEGIN
        UPDATE Reservations
        SET Status = 'Completed'
        WHERE ReservationID = @ReservationID;
    END
    ELSE
    BEGIN
        RAISERROR('The reservation cannot be completed because it is not in the Approved status.', 16, 1);
        RETURN;
    END
END;

--Upcoming Reservation for a specific user
CREATE PROCEDURE ViewUpcomingReservations
    @UserID INT
AS
BEGIN
    SELECT * FROM Reservations
    WHERE UserID = @UserID AND Time > GETDATE()
    ORDER BY Time ASC;
END;

--Past reservations for a specific user
CREATE PROCEDURE ViewPastReservations
    @UserID INT
AS
BEGIN
    SELECT * FROM Reservations
    WHERE UserID = @UserID AND Time <= GETDATE()
    ORDER BY Time DESC;
END;

--View reservations for a restaurant
CREATE PROCEDURE GetRestaurantReservations
@Restaurantid INT
AS
BEGIN
    SELECT R.* FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE T.RestaurantID = @Restaurantid;
END;

--Get reservations with special requests
SELECT * FROM Reservations WHERE Request IS NOT NULL AND Request <> '';

--Process reservation payment
CREATE PROCEDURE ProcessReservationPayment(
    @ReservationID INT,
    @Amount INT,
    @Method NVARCHAR(10)
)
AS
BEGIN
    INSERT INTO Payments (ReservationID, Amount, PaymentDate, Status, Method)
    VALUES (@ReservationID, @Amount, GETDATE(), 'Completed', @Method);
END;

--Reviews

--Retrieve all Reviews for a specific Restaurant
SELECT *
FROM Reviews
WHERE RestaurantID = @Restaurantid;

--Retrieve all reviews from a specific user
SELECT *
FROM Reviews
WHERE UserID = @Userid;

-- Insert a new review for a specific user
CREATE PROCEDURE InsertReview
    @ReviewID INT,
    @UserID INT,
    @RestaurantID INT,
    @Rating INT,
    @Comment NVARCHAR(MAX)
AS
BEGIN
    -- Validate that the user is a customer
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Customer')
    BEGIN
        RAISERROR ('Only customers can insert reviews.', 16, 1);
        RETURN;
    END

    -- Validate that rating is between 1 and 5
    IF @Rating < 1 OR @Rating > 5
    BEGIN
        RAISERROR ('Rating must be between 1 and 5', 16, 1);
        RETURN;
    END

    -- Insert the new review
    INSERT INTO Reviews (ReviewID, UserID, RestaurantID, Rating, Comment)
    VALUES (@ReviewID, @UserID, @RestaurantID, @Rating, @Comment);
END;

--Average rating of a restaurant
SELECT RestaurantID, AVG(Rating) AS AverageRating
FROM Reviews
WHERE RestaurantID = @RestaurantID
GROUP BY RestaurantID;

-- Delete a review (user deletion only)
CREATE PROCEDURE DeleteReview
    @ReviewID INT,
    @UserID INT
AS
BEGIN
    -- Check if the review exists
    IF NOT EXISTS (SELECT 1 FROM Reviews WHERE ReviewID = @ReviewID)
    BEGIN
        RAISERROR ('Review not found.', 16, 1);
        RETURN;
    END

    -- Check if the user is the one who created the review
    IF EXISTS (SELECT 1 FROM Reviews WHERE ReviewID = @ReviewID AND UserID = @UserID)
    BEGIN
        -- User is deleting their own review
        DELETE FROM Reviews WHERE ReviewID = @ReviewID AND UserID = @UserID;
        RETURN;
    END

    -- If the user didn't create the review, raise an error
    RAISERROR ('You are not authorized to delete this review.', 16, 1);
END;


--Retrieve top rated restaurants
SELECT r.RestaurantID, r.Name, AVG(rev.Rating) AS AverageRating
FROM Restaurants r
JOIN Reviews rev ON r.RestaurantID = rev.RestaurantID
GROUP BY r.RestaurantID, r.Name
ORDER BY AverageRating DESC;

--Top rated restaurants for a specific cuisine
SELECT r.RestaurantID, r.Name, AVG(rv.Rating) AS AvgRating
FROM Restaurants r
JOIN Reviews rv ON r.RestaurantID = rv.RestaurantID
JOIN RestCuisines rc ON r.RestaurantID = rc.RestaurantID
JOIN Cuisines c ON rc.CuisineID = c.CuisineID
WHERE c.Name = @CuisineName
GROUP BY r.RestaurantID, r.Name
ORDER BY AvgRating DESC;


--Cuisines

--All cuisine options for the user
SELECT CuisineID, Name, Description FROM Cuisines;

--Cuisines offered by a specific restaurant
SELECT c.CuisineID, c.Name
FROM Cuisines c
JOIN RestCuisines rc ON c.CuisineID = rc.CuisineID
WHERE rc.RestaurantID = @Restaurantid;

--Get most popular cuisines
SELECT c.CuisineID, c.Name, COUNT(upc.UserID) AS PreferenceCount
FROM Cuisines c
JOIN UserPrefCuisines upc ON c.CuisineID = upc.CuisineID
GROUP BY c.CuisineID, c.Name
ORDER BY PreferenceCount DESC;

--Restaurants that offer most variety of cuisines
SELECT r.RestaurantID, r.Name, COUNT(rc.CuisineID) AS CuisineVariety
FROM Restaurants r
JOIN RestCuisines rc ON r.RestaurantID = rc.RestaurantID
GROUP BY r.RestaurantID, r.Name
ORDER BY CuisineVariety DESC;

-- Remove a cuisine if the restaurant stops serving it at all (admin only)
CREATE PROCEDURE RemoveCuisineFromRestaurant
    @CuisineID INT,
    @RestaurantID INT,
    @UserID INT
AS
BEGIN
    -- Check if the user is an admin of the restaurant
    IF NOT EXISTS (SELECT 1
                   FROM RestaurantAdmins
                   WHERE RestaurantID = @RestaurantID AND UserID = @UserID)
    BEGIN
        RAISERROR ('You must be an admin of the restaurant to remove a cuisine.', 16, 1);
        RETURN;
    END

    -- Remove the cuisine from the restaurant
    DELETE FROM RestCuisines
    WHERE CuisineID = @CuisineID AND RestaurantID = @RestaurantID;
END;


 --Restaurant preferences

--All preferred restaurants for a user
SELECT r.RestaurantID, r.Name, r.Description, r.Location, r.PhoneNum
FROM UserPrefRests upr
JOIN Restaurants r ON upr.RestaurantID = r.RestaurantID
WHERE upr.UserID = @Userid;

--Insert a new preference for a user
INSERT INTO UserPrefRests (UserID, RestaurantID)
VALUES (@Userid, @Restaurantid);

--Remove preferred restaurant for a user
DELETE FROM UserPrefRests
WHERE UserID = @Userid AND RestaurantID = @Restaurantid;

--Suggest restaurants to users based on popularity
SELECT r.RestaurantID, r.Name, COUNT(upr.UserID) AS PreferenceCount
FROM UserPrefRests upr
JOIN Restaurants r ON upr.RestaurantID = r.RestaurantID
WHERE upr.RestaurantID NOT IN (
    SELECT RestaurantID FROM UserPrefRests WHERE UserID = @Userid
)
GROUP BY r.RestaurantID, r.Name
ORDER BY PreferenceCount DESC;

--Cuisine pref

--Remove a preferred cuisine for a user
DELETE FROM UserPrefCuisines
WHERE UserID = @Userid AND CuisineID = @Cuisineid;

--Get all preferred cuisines for a user
SELECT c.CuisineID, c.Name, c.Description
FROM UserPrefCuisines upc
JOIN Cuisines c ON upc.CuisineID = c.CuisineID
WHERE upc.UserID = @Userid;

--Insert cuisine pref for a user
CREATE PROCEDURE InsertCuisine
    @Name NVARCHAR(50),
    @Description NVARCHAR(MAX)
AS
BEGIN
    -- Error handling setup
    SET NOCOUNT ON;

    -- Check if the cuisine already exists
    IF EXISTS (SELECT 1 FROM Cuisines WHERE Name = @Name)
    BEGIN
        RAISERROR ('Cuisine already exists.', 16, 1);
        RETURN;
    END

    -- Insert the new cuisine
    INSERT INTO Cuisines (CuisineID, Name, Description)
    VALUES (NEWID(), @Name, @Description);

    PRINT 'Cuisine inserted successfully';
END;

--Payment

--Insert payment
CREATE PROCEDURE InsertPayment
    @PaymentID INT,
    @ReservationID INT,
    @Amount INT,
    @Status NVARCHAR(10),
    @Method NVARCHAR(10)
AS
BEGIN
    -- Ensure that the reservation exists before inserting the payment
    IF NOT EXISTS (SELECT 1 FROM Reservations WHERE ReservationID = @ReservationID)
    BEGIN
        RAISERROR('Invalid ReservationID. Reservation does not exist.', 16, 1);
        RETURN;
    END

    -- Insert the new payment
    INSERT INTO Payments (PaymentID, ReservationID, Amount, PaymentDate, Status, Method)
    VALUES (@PaymentID, @ReservationID, @Amount, GETDATE(), @Status, @Method);
END;

--Payment history for a specific user
SELECT P.*
FROM Payments P
JOIN Reservations R ON P.ReservationID = R.ReservationID
WHERE R.UserID = @Userid
ORDER BY P.PaymentDate DESC;

--Update Payment status
CREATE PROCEDURE UpdatePaymentStatus
    @Paymentid INT,
    @NewStatus NVARCHAR(10)
AS
BEGIN
    -- Ensure that the payment exists before updating
    IF NOT EXISTS (SELECT 1 FROM Payments WHERE PaymentID = @Paymentid)
    BEGIN
        RAISERROR('Invalid PaymentID. Payment does not exist.', 16, 1);
        RETURN;
    END

    -- Ensure the new status is valid
    IF @NewStatus NOT IN ('Pending', 'Completed', 'Failed')
    BEGIN
        RAISERROR('Invalid Status. Allowed values: Pending, Completed, Failed.', 16, 1);
        RETURN;
    END

    -- Update the payment status
    UPDATE Payments
    SET Status = @NewStatus
    WHERE PaymentID = @Paymentid;
END;

--Delete a payment record (admin)
DELETE FROM Payments WHERE PaymentID = @Paymentid;

--Total revenue for a restaurant
SELECT R.RestaurantID, R.Name AS RestaurantName, SUM(P.Amount) AS TotalRevenue
FROM Payments P
JOIN Reservations Res ON P.ReservationID = Res.ReservationID
JOIN Tables T ON Res.TableID = T.TableID
JOIN Restaurants R ON T.RestaurantID = R.RestaurantID
WHERE P.Status = 'Completed' AND R.RestaurantID = @Restaurantid
GROUP BY R.RestaurantID, R.Name;
