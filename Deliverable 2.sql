--Users

--Select all Users
Select * from Users
GO

--Select a specific User
Select * from  Users
where UserID=@Userid
GO

--Register User
CREATE OR ALTER PROCEDURE RegisterUser
    @Name NVARCHAR(50),
    @Username NVARCHAR(20),
    @Password NVARCHAR(16),
    @Email NVARCHAR(100),
    @PhoneNum NVARCHAR(13),
    @Role NVARCHAR(10),
    @ProfilePic VARBINARY(MAX) = NULL
AS
BEGIN
    -- Check if the role is valid
    IF NOT EXISTS (SELECT 1 FROM (VALUES ('Customer'), ('Admin'), ('Staff')) AS ValidRoles(Role) WHERE Role = @Role)
    BEGIN
        RAISERROR('Invalid role specified. Valid roles are: Customer, Admin, Staff.', 16, 1);
        RETURN;
    END

    -- Check if user already exists with the same username, email, or phone number
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username OR Email = @Email OR PhoneNum = @PhoneNum)
    BEGIN
        RAISERROR('User already exists with this username, email, or phone number.', 16, 1);
        RETURN;
    END

    -- Insert new user
    INSERT INTO Users (Name, Username, Password, Email, PhoneNum, Role, ProfilePic) 
    VALUES (@Name, @Username, @Password, @Email, @PhoneNum, @Role, @ProfilePic);
END;
GO

--Delete User
CREATE OR ALTER PROCEDURE DeleteUser
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
GO

--Update User Information
CREATE OR ALTER PROCEDURE UpdateUser
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
GO

--Retrieve by role
SELECT * FROM Users WHERE Role = @Role;
GO

--Authenticate User
CREATE OR ALTER PROCEDURE AuthenticateUser
    @Username NVARCHAR(20),
    @Password NVARCHAR(16)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND Password = @Password)
        SELECT 'Login Successful' AS Message;
    ELSE
        RAISERROR ('Invalid Username or Password.', 16, 1);
END;
GO

--Change Password
CREATE OR ALTER PROCEDURE ChangePassword
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
GO

--Get User Reservations
CREATE OR ALTER PROCEDURE GetUserReservations
    @UserID INT
AS
BEGIN
    SELECT *
    FROM Reservations
    WHERE UserID = @UserID;
END;
GO

--Get User Reviews
CREATE OR ALTER PROCEDURE GetUserReviews
    @UserID INT
AS
BEGIN
    SELECT *
    FROM Reviews 
    WHERE UserID = @UserID;
END;
GO

--Get My Restaurants (Admin)
SELECT 
    Restaurants.RestaurantID,
    Restaurants.Name,
    Restaurants.Description,
    Restaurants.Location,
    Restaurants.PhoneNum,
    Restaurants.OperatingHoursStart,
    Restaurants.OperatingHoursEnd,
    Restaurants.Status,
    Restaurants.ProfilePic,
    RestaurantAdmins.UserID
FROM Restaurants
JOIN RestaurantAdmins ON Restaurants.RestaurantID = RestaurantAdmins.RestaurantID
WHERE RestaurantAdmins.UserID = @Userid;

GO

--Get Cuisine Prefs
SELECT Cuisines.CuisineID, Cuisines.Name, Cuisines.Description, UserPrefCuisines.UserID FROM Cuisines
JOIN UserPrefCuisines ON Cuisines.CuisineID = UserPrefCuisines.CuisineID
WHERE UserPrefCuisines.UserID = @UserID
GO

--Add Cuisine Prefs
CREATE OR ALTER PROCEDURE AddUserCuisinePreference
    @UserID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if User exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User does not exist.', 16, 1);
        RETURN;
    END

    -- Check if Cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine does not exist.', 16, 1);
        RETURN;
    END

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
GO

--Delete Cuisine Prefs
CREATE OR ALTER PROCEDURE RemoveUserCuisinePreference
    @UserID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if User exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User does not exist.', 16, 1);
        RETURN;
    END

    -- Check if Cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the user has this cuisine preference
    IF NOT EXISTS (SELECT 1 FROM UserPrefCuisines WHERE UserID = @UserID AND CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('User does not have this cuisine preference.', 16, 1);
        RETURN;
    END

    -- Delete the specific cuisine preference
    DELETE FROM UserPrefCuisines 
    WHERE UserID = @UserID AND CuisineID = @CuisineID;
END;
GO

--Get Users Preference of restaurants
SELECT Restaurants.RestaurantID, Restaurants.Name, Restaurants.Description, Restaurants.Location, Restaurants.PhoneNum, Restaurants.OperatingHoursStart, Restaurants.OperatingHoursEnd, Restaurants.Status, Restaurants.ProfilePic, UserPrefRests.UserID FROM Restaurants
JOIN UserPrefRests ON Restaurants.RestaurantID = UserPrefRests.RestaurantID
WHERE UserPrefRests.UserID = @UserID

--Add user restaurant perference
CREATE OR ALTER PROCEDURE AddUserRestaurantPreference
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
    -- Check if the user exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist.', 16, 1);
        RETURN;
    END

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
GO

--Delete user restaurant preferences
CREATE OR ALTER PROCEDURE RemoveUserRestaurantPreference
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
	-- Check if User exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User does not exist.', 16, 1);
        RETURN;
    END

    -- Check if Restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist.', 16, 1);
        RETURN;
    END
    -- Check if the user has this restaurant preference
    IF NOT EXISTS (SELECT 1 FROM UserPrefRests WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('User does not have this restaurant preference.', 16, 1);
        RETURN;
    END

    -- Delete the specific restaurant preference
    DELETE FROM UserPrefRests WHERE UserID = @UserID AND RestaurantID = @RestaurantID;
END;
GO


--Restaurants

--Get all restaurants
SELECT * FROM Restaurants;
GO

--Get a specific restaurant
SELECT * FROM Restaurants WHERE RestaurantID = @RestaurantID;
GO

--Register new restaurant 
CREATE OR ALTER PROCEDURE RegisterRestaurant
    @UserID INT,
    @Name NVARCHAR(50),
    @Description NVARCHAR(MAX),
    @Location NVARCHAR(100),
    @PhoneNum NVARCHAR(13),
    @OperatingHoursStart TIME,
    @OperatingHoursEnd TIME,
    @ProfilePic VARBINARY(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the user is an Admin
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        RAISERROR ('Only admins can register a new restaurant.', 16, 1);
        RETURN;
    END

    -- Validate required fields
    IF LEN(ISNULL(@Name, '')) = 0
    BEGIN
        RAISERROR ('Restaurant name is required.', 16, 1);
        RETURN;
    END

    IF LEN(ISNULL(@Location, '')) = 0
    BEGIN
        RAISERROR ('Location is required.', 16, 1);
        RETURN;
    END

    IF LEN(ISNULL(@PhoneNum, '')) = 0
    BEGIN
        RAISERROR ('Phone number is required.', 16, 1);
        RETURN;
    END

    -- Validate phone number format (basic length check)
    IF LEN(@PhoneNum) < 10 OR LEN(@PhoneNum) > 13
    BEGIN
        RAISERROR ('Phone number must be between 10 and 13 digits.', 16, 1);
        RETURN;
    END

    -- Validate operating hours logic
    IF @OperatingHoursStart >= @OperatingHoursEnd
    BEGIN
        RAISERROR ('OperatingHoursStart must be earlier than OperatingHoursEnd.', 16, 1);
        RETURN;
    END

    -- Insert the new restaurant
    INSERT INTO Restaurants (
        Name,
        Description,
        Location,
        PhoneNum,
        OperatingHoursStart,
        OperatingHoursEnd,
        ProfilePic
    )
    VALUES (
        @Name,
        @Description,
        @Location,
        @PhoneNum,
        @OperatingHoursStart,
        @OperatingHoursEnd,
        @ProfilePic
    );

    -- Get the new RestaurantID
    DECLARE @RestaurantID INT = SCOPE_IDENTITY();

    -- Assign the registering admin as the restaurant admin
    INSERT INTO RestaurantAdmins (RestaurantID, UserID)
    VALUES (@RestaurantID, @UserID);

    -- Optional: Return the new RestaurantID to the caller
    SELECT @RestaurantID AS NewRestaurantID;
END;
GO

--Update restaurant info
CREATE OR ALTER PROCEDURE UpdateRestaurant
    @UserID INT,
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

    -- Check if user is Admin
    IF EXISTS (SELECT 1 FROM RestaurantAdmins WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        -- VALIDATION (only validate if value is provided)
        IF @PhoneNum IS NOT NULL AND (LEN(@PhoneNum) < 10 OR LEN(@PhoneNum) > 13)
        BEGIN
            RAISERROR ('Phone number must be between 10 and 13 digits.', 16, 1);
            RETURN;
        END

        IF @OperatingHoursStart IS NOT NULL AND @OperatingHoursEnd IS NOT NULL AND @OperatingHoursStart >= @OperatingHoursEnd
        BEGIN
            RAISERROR ('OperatingHoursStart must be earlier than OperatingHoursEnd.', 16, 1);
            RETURN;
        END

        IF @Status IS NOT NULL AND @Status NOT IN ('Open', 'Closed', 'Inactive')
        BEGIN
            RAISERROR ('Invalid status. Allowed values: Open, Closed, Inactive.', 16, 1);
            RETURN;
        END

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

    -- If user is a Staff
    IF EXISTS (SELECT 1 FROM RestaurantStaff WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        -- VALIDATION for staff updates
        IF @OperatingHoursStart IS NOT NULL AND @OperatingHoursEnd IS NOT NULL AND @OperatingHoursStart >= @OperatingHoursEnd
        BEGIN
            RAISERROR ('OperatingHoursStart must be earlier than OperatingHoursEnd.', 16, 1);
            RETURN;
        END

        IF @Status IS NOT NULL AND @Status NOT IN ('Open', 'Closed', 'Inactive')
        BEGIN
            RAISERROR ('Invalid status. Allowed values: Open, Closed, Inactive.', 16, 1);
            RETURN;
        END

        UPDATE Restaurants
        SET 
            OperatingHoursStart = COALESCE(@OperatingHoursStart, OperatingHoursStart),
            OperatingHoursEnd = COALESCE(@OperatingHoursEnd, OperatingHoursEnd),
            Status = COALESCE(@Status, Status)
        WHERE RestaurantID = @RestaurantID;
        RETURN;
    END

    -- Unauthorized
    RAISERROR ('Unauthorized action.', 16, 1);
END;
GO

--Delete a restaurant
CREATE OR ALTER PROCEDURE DeleteRestaurant
    @UserID INT,
    @RestaurantID INT
AS
BEGIN
    -- Check if the user exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant not found.', 16, 1);
        RETURN;
    END

    -- Check if the user is an Admin of the specific restaurant
    IF NOT EXISTS (SELECT 1 FROM RestaurantAdmins WHERE UserID = @UserID AND RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Only admins of the restaurant can delete it.', 16, 1);
        RETURN;
    END

    -- Delete the restaurant
    DELETE FROM Restaurants WHERE RestaurantID = @RestaurantID;
END;
GO

--Retrive Restaurants by optional search, location, cuisine filters, favorite filters, and alphabetical or rating wise sorting
CREATE OR ALTER PROCEDURE SearchRestaurants
    @UserID INT,
    @SearchTerm NVARCHAR(100) = NULL,
    @SortBy NVARCHAR(20) = 'Name',      -- or 'Rating'
    @FilterBy NVARCHAR(20) = NULL,      -- 'PreferredRestaurants', 'PreferredCuisines', or NULL
    @Location NVARCHAR(100) = NULL      -- Optional location filter
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        R.RestaurantID,
        R.Name,
        R.Description,
        R.Location,
        R.PhoneNum,
        R.OperatingHoursStart,
        R.OperatingHoursEnd,
        R.Status,
        R.ProfilePic,
        ISNULL(AVG(CAST(Rev.Rating AS FLOAT)), 0) AS AverageRating
    FROM Restaurants R
    LEFT JOIN Reviews Rev ON R.RestaurantID = Rev.RestaurantID
    WHERE 
        R.Status = 'Open' AND
        (@SearchTerm IS NULL OR R.Name LIKE '%' + @SearchTerm + '%') AND
        (@Location IS NULL OR R.Location = @Location) AND
        (
            @FilterBy IS NULL OR
            (
                @FilterBy = 'PreferredRestaurants' AND EXISTS (
                    SELECT 1 FROM UserPrefRests UR
                    WHERE UR.UserID = @UserID AND UR.RestaurantID = R.RestaurantID
                )
            ) OR
            (
                @FilterBy = 'PreferredCuisines' AND EXISTS (
                    SELECT 1 FROM RestCuisines RC
                    JOIN UserPrefCuisines UPC ON RC.CuisineID = UPC.CuisineID
                    WHERE RC.RestaurantID = R.RestaurantID AND UPC.UserID = @UserID
                )
            )
        )
    GROUP BY 
        R.RestaurantID, R.Name, R.Description, R.Location, R.PhoneNum,
        R.OperatingHoursStart, R.OperatingHoursEnd, R.Status, R.ProfilePic
    ORDER BY 
        CASE WHEN @SortBy = 'Rating' THEN ISNULL(AVG(CAST(Rev.Rating AS FLOAT)), 0) END DESC,
        CASE WHEN @SortBy = 'Name' THEN R.Name END ASC;
END;
GO

--Assign admin to a restaurant
CREATE OR ALTER PROCEDURE AssignRestaurantAdmin
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
GO

--Remove admin from restaurant
CREATE OR ALTER PROCEDURE RemoveRestaurantAdmin
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
GO

--All admins for a specfic restaurant
SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
FROM Users U  
JOIN RestaurantAdmins RA ON U.UserID = RA.UserID  
WHERE RA.RestaurantID = @Restaurantid;  
GO

-- Assign staff to a restaurant
CREATE OR ALTER PROCEDURE AssignRestaurantStaff
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
GO

-- Remove staff from restaurant
CREATE OR ALTER PROCEDURE RemoveRestaurantStaff
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
GO

-- All staff for a specific restaurant
SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
FROM Users U  
JOIN RestaurantStaff RS ON U.UserID = RS.UserID  
WHERE RS.RestaurantID = @RestaurantID;
GO

--Add Rest Image
CREATE OR ALTER PROCEDURE AddRestaurantImage
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
GO

--Delete Rest Image
CREATE OR ALTER PROCEDURE DeleteRestaurantImage
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
GO

--View Rest Images
Select Image from RestImages
where RestaurantID=@RestaurantID;
GO

--Add Cuisine to Restaurant
CREATE OR ALTER PROCEDURE AddCuisineToRestaurant
    @RestaurantID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the cuisine is already assigned to the restaurant
    IF EXISTS (SELECT 1 FROM RestCuisines WHERE RestaurantID = @RestaurantID AND CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine is already assigned to the restaurant.', 16, 1);
        RETURN;
    END

    -- Add the cuisine to the restaurant
    INSERT INTO RestCuisines (CuisineID, RestaurantID)
    VALUES (@CuisineID, @RestaurantID);
END;
GO

--Remove Cuisine from Restaurant
CREATE OR ALTER PROCEDURE RemoveCuisineFromRestaurant
    @RestaurantID INT,
    @CuisineID INT
AS
BEGIN
    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the cuisine is currently assigned to the restaurant
    IF NOT EXISTS (SELECT 1 FROM RestCuisines WHERE RestaurantID = @RestaurantID AND CuisineID = @CuisineID)
    BEGIN
        RAISERROR ('Cuisine is not currently assigned to the restaurant.', 16, 1);
        RETURN;
    END

    -- Remove the cuisine from the restaurant
    DELETE FROM RestCuisines
    WHERE CuisineID = @CuisineID AND RestaurantID = @RestaurantID;
END;
GO

--View Restaurants Cuisines
CREATE OR ALTER PROCEDURE GetCuisinesForRestaurant
    @RestaurantID INT
AS
BEGIN
    -- Check if the restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist.', 16, 1);
        RETURN;
    END

    -- Select all cuisines associated with the restaurant
    SELECT 
        c.CuisineID,
        c.Name AS CuisineName,
        c.Description
    FROM RestCuisines rc
    INNER JOIN Cuisines c ON rc.CuisineID = c.CuisineID
    WHERE rc.RestaurantID = @RestaurantID;
END;
GO

--Open/Close Restaurant
CREATE OR ALTER PROCEDURE SetRestaurantStatus
    @RestaurantID INT,
    @Status NVARCHAR(10)  -- 'Open' or 'Closed'
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate status input
    IF @Status NOT IN ('Open', 'Closed')
    BEGIN
        RAISERROR('Invalid status. Use "Open" or "Closed".', 16, 1);
        RETURN;
    END

    -- Check if restaurant exists
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR('Restaurant with the given ID does not exist.', 16, 1);
        RETURN;
    END

    -- Update the status
    UPDATE Restaurants
    SET Status = @Status
    WHERE RestaurantID = @RestaurantID;
END;
GO


--Tables

--Get all tables in a restaurant
SELECT * FROM Tables WHERE RestaurantID = @Restaurantid
GO

--Check table availability
CREATE OR ALTER PROCEDURE CheckTableAvailability
    @TableID INT
AS
BEGIN
    SELECT Status FROM Tables WHERE TableID = @TableID;
END;
GO

--Insert a table for a restaurant
CREATE OR ALTER PROCEDURE AddTable
    @UserID INT,           -- The user making the request
    @Capacity INT,
    @Description NVARCHAR(MAX),
    @RestaurantID INT
AS
BEGIN
    SET NOCOUNT ON;
	
	--Validate input
    IF @Capacity IS NULL OR @Capacity <= 0
    BEGIN
        RAISERROR('Invalid Capacity. Must be greater than zero.', 16, 1);
        RETURN;
    END

    IF @RestaurantID IS NULL OR @RestaurantID <= 0
    BEGIN
        RAISERROR('Invalid RestaurantID.', 16, 1);
        RETURN;
    END

    -- Ensure the user is an admin of the restaurant
    IF NOT EXISTS (
        SELECT 1 FROM RestaurantAdmins 
        WHERE UserID = @UserID AND RestaurantID = @RestaurantID
    )
    BEGIN
        RAISERROR('Only admins can add tables.', 16, 1);
        RETURN;
    END

    -- Insert the new table
    INSERT INTO Tables (Capacity, Description, RestaurantID)
    VALUES (@Capacity, @Description, @RestaurantID);
END;
GO

--Update table information
CREATE OR ALTER PROCEDURE UpdateTable
    @UserID INT,         -- The user making the request
    @TableID INT,
    @Capacity INT = NULL,
    @Status NVARCHAR(10) = NULL,
    @Description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @RestaurantID INT;

    -- Validate input TableID
    IF @TableID IS NULL OR @TableID <= 0
    BEGIN
        RAISERROR ('Invalid TableID.', 16, 1);
        RETURN;
    END

    -- Validate Capacity if provided
    IF @Capacity IS NOT NULL AND @Capacity <= 0
    BEGIN
        RAISERROR ('Capacity must be greater than zero.', 16, 1);
        RETURN;
    END

    -- Validate Status if provided (example values: 'Available', 'Reserved', 'Occupied')
    IF @Status IS NOT NULL AND @Status NOT IN ('Free', 'Reserved', 'Occupied')
    BEGIN
        RAISERROR ('Invalid Status. Must be Free, Reserved, or Occupied.', 16, 1);
        RETURN;
    END

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
GO

--Delete table 
CREATE OR ALTER PROCEDURE DeleteTable
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
GO

--Change table availability (manual by staff)
CREATE OR ALTER PROCEDURE UpdateTableStatus
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

    -- Additional validation to prevent staff from occupying a table that is already reserved or occupied
    IF @NewStatus = 'Occupied'
    BEGIN
        -- Check if the table is already reserved or occupied
        IF EXISTS (SELECT 1 FROM Tables WHERE TableID = @TableID AND Status IN ('Reserved', 'Occupied'))
        BEGIN
            RAISERROR ('Cannot occupy this table. It is either reserved or already occupied.', 16, 1);
            RETURN;
        END
    END

    -- Update table status
    UPDATE Tables
    SET Status = @NewStatus
    WHERE TableID = @TableID;
END;
GO

--Find available tables
CREATE OR ALTER PROCEDURE GetAvailableTables
    @RestaurantID INT
AS
BEGIN
    SELECT * FROM Tables
    WHERE RestaurantID = @RestaurantID
    AND Status = 'Free';
END;
GO

--Find table by your desired table size
CREATE OR ALTER PROCEDURE GetTablesByCapacity
    @RestaurantID INT,
    @MinCapacity INT
AS
BEGIN
    SELECT * FROM Tables
    WHERE RestaurantID = @RestaurantID
    AND Capacity >= @MinCapacity
    AND Status = 'Free';
END;
GO

--Reset tables at closing time (when the restaurant's gonna close, it sets all tables status to free for the next day)
CREATE OR ALTER PROCEDURE ResetTablesAtClosing
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
GO


--Reservations

--Add reservation
CREATE OR ALTER PROCEDURE AddReservation(
	@RestaurantID INT,
    @UserID INT,
    @TableID INT,
    @Time DATETIME,
    @Duration INT,
    @People INT,
    @Request NVARCHAR(MAX)
)
AS
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        RAISERROR('User does not exist.', 16, 1);
        RETURN;
    END

    -- Check if table exists
    IF NOT EXISTS (SELECT 1 FROM Tables WHERE TableID = @TableID)
    BEGIN
        RAISERROR('Table does not exist.', 16, 1);
        RETURN;
    END

    -- Check if Time is in the future
    IF @Time <= GETDATE()
    BEGIN
        RAISERROR('Reservation time must be in the future.', 16, 1);
        RETURN;
    END

    -- Check if Duration and People are positive
    IF @Duration <= 0 OR @People <= 0
    BEGIN
        RAISERROR('Duration and People must be greater than 0.', 16, 1);
        RETURN;
    END

    -- Check if the number of people exceeds the table's capacity
    DECLARE @TableCapacity INT;
    SELECT @TableCapacity = Capacity FROM Tables WHERE TableID = @TableID;

    IF @People > @TableCapacity
    BEGIN
        RAISERROR('Number of people exceeds the table capacity.', 16, 1);
        RETURN;
    END

    -- Check if the table is already reserved at that time (conflict check)
    IF EXISTS (
        SELECT 1 FROM Reservations
        WHERE TableID = @TableID
        AND Status IN ('Pending', 'Approved')
        AND (
            @Time < DATEADD(MINUTE, Duration, Time) AND
            DATEADD(MINUTE, @Duration, @Time) > Time
        )
    )
    BEGIN
        RAISERROR('Table is already reserved during the requested time slot.', 16, 1);
        RETURN;
    END

    -- Insert reservation
    INSERT INTO Reservations 
    VALUES (@RestaurantID,@UserID, @TableID, @Time, @Duration, @People, @Request, 'Pending');
END;
GO

--Update reservation details
CREATE OR ALTER PROCEDURE ModifyReservation
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
    SELECT @RestaurantID=T.RestaurantID,  @ReservationUserID=R.UserID, @ReservationStatus=R.Status
    FROM Reservations R
    JOIN Tables T ON R.TableID = T.TableID
    WHERE R.ReservationID = @ReservationID;

    -- Check if the reservation exists
    IF @ReservationID IS NULL OR NOT EXISTS (SELECT 1 FROM Reservations WHERE ReservationID = @ReservationID)
    BEGIN
        RAISERROR('Reservation does not exist.', 16, 1);
        RETURN;
    END

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

    -- Check if the new time is in the future
    IF @NewTime IS NOT NULL AND @NewTime <= GETDATE()
    BEGIN
        RAISERROR('Reservation time must be in the future.', 16, 1);
        RETURN;
    END

    -- Check if Duration and People are positive
    IF (@NewDuration IS NOT NULL AND @NewDuration <= 0) OR (@NewPeople IS NOT NULL AND @NewPeople <= 0)
    BEGIN
        RAISERROR('Duration and People must be greater than 0.', 16, 1);
        RETURN;
    END

    -- Check if the table is available for the new time slot (conflict check)
    IF @NewTime IS NOT NULL
    BEGIN
        IF EXISTS (
            SELECT 1 FROM Reservations
            WHERE TableID = (SELECT TableID FROM Reservations WHERE ReservationID = @ReservationID)
            AND Status IN ('Pending', 'Approved')
            AND (
                @NewTime < DATEADD(MINUTE, Duration, Time) AND
                DATEADD(MINUTE, @NewDuration, @NewTime) > Time
            )
        )
        BEGIN
            RAISERROR('Table is already reserved during the requested time slot.', 16, 1);
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
GO

--Cancel a Reservation
CREATE OR ALTER PROCEDURE CancelReservation
    @ReservationID INT,
    @UserID INT   -- User requesting the cancellation
AS
BEGIN
    DECLARE @RestaurantID INT, @ReservationUserID INT, @TableID INT;

    -- Get the RestaurantID of the table associated with the reservation
    SELECT @RestaurantID = T.RestaurantID, 
           @ReservationUserID = R.UserID,
           @TableID = T.TableID
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

    -- Set the associated table status to 'Free'
    UPDATE Tables
    SET Status = 'Free'
    WHERE TableID = @TableID;
    
END;
GO

--Approve a Reservation
CREATE OR ALTER PROCEDURE ApproveReservation
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
GO

--Complete a reservation
CREATE OR ALTER PROCEDURE CompleteReservation
    @ReservationID INT,
    @UserID INT           -- The staff member completing the reservation
AS
BEGIN
    DECLARE @RestaurantID INT, @ReservationUserID INT, @TableID INT;
    
    -- Get the restaurant ID from the table associated with the reservation
    SELECT @RestaurantID=T.RestaurantID, @ReservationUserID=R.UserID,@TableID=R.TableID
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

		-- Change the table status to 'Occupied'
		UPDATE Tables
		SET Status = 'Occupied'
		WHERE TableID = @TableID;
    END
    ELSE
    BEGIN
        RAISERROR('The reservation cannot be completed because it is not in the Approved status.', 16, 1);
        RETURN;
    END
END;
GO

--View reservations by status optionally for users or restaurants
CREATE OR ALTER PROCEDURE ViewReservations
    @UserID INT = NULL,            -- Optional: Filter by user
    @RestaurantID INT = NULL,       -- Optional: Filter by restaurant
    @Status NVARCHAR(10) = NULL    -- Optional: Filter by status
AS
BEGIN
    -- Check if RestaurantID is provided and exists
    IF @RestaurantID IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
        BEGIN
            RAISERROR('Restaurant not found', 16, 1);
            RETURN;
        END
    END

    -- Retrieve reservations
    SELECT r.ReservationID, r.UserID, r.TableID, r.Time, r.Duration, r.People, r.Request, r.Status,
           t.Capacity, t.Description AS TableDescription, res.Name AS RestaurantName
    FROM Reservations r
    JOIN Tables t ON r.TableID = t.TableID
    JOIN Restaurants res ON t.RestaurantID = res.RestaurantID
    WHERE 
        (@UserID IS NULL OR r.UserID = @UserID) AND
        (@RestaurantID IS NULL OR t.RestaurantID = @RestaurantID) AND
        (@Status IS NULL OR r.Status = @Status)
    ORDER BY r.Time DESC;  -- Order by reservation time
END;
GO

--Process reservation payment
CREATE OR ALTER PROCEDURE ProcessReservationPayment(
    @ReservationID INT,
    @Amount INT,
    @Method NVARCHAR(10)
)
AS
BEGIN
    INSERT INTO Payments (ReservationID, Amount, PaymentDate, Status, Method)
    VALUES (@ReservationID, @Amount, GETDATE(), 'Completed', @Method);
END;
GO


--Reviews

--Retrieve all Reviews for a specific Restaurant
SELECT *
FROM Reviews
WHERE RestaurantID = @Restaurantid;
GO

--Retrieve all reviews from a specific user
SELECT *
FROM Reviews
WHERE UserID = @Userid;
GO

-- Insert a new review for a specific user
CREATE OR ALTER PROCEDURE InsertReview
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

	-- Validate that the restaurant exists 
    IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE RestaurantID = @RestaurantID)
    BEGIN
        RAISERROR ('Restaurant does not exist!', 16, 1);
        RETURN;
    END

    -- Validate that rating is between 1 and 5
    IF @Rating < 1 OR @Rating > 5
    BEGIN
        RAISERROR ('Rating must be between 1 and 5', 16, 1);
        RETURN;
    END

    -- Insert the new review
    INSERT INTO Reviews (UserID, RestaurantID, Rating, Comment)
    VALUES (@UserID, @RestaurantID, @Rating, @Comment);
END;
GO

--Average rating of a restaurant
SELECT RestaurantID, AVG(Rating) AS AverageRating
FROM Reviews
WHERE RestaurantID = @RestaurantID
GROUP BY RestaurantID;
GO

-- Delete a review (user deletion only)
CREATE OR ALTER PROCEDURE DeleteReview
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

    -- Check if the user is the one who CREATE OR ALTERd the review
    IF EXISTS (SELECT 1 FROM Reviews WHERE ReviewID = @ReviewID AND UserID = @UserID)
    BEGIN
        -- User is deleting their own review
        DELETE FROM Reviews WHERE ReviewID = @ReviewID AND UserID = @UserID;
        RETURN;
    END

    -- If the user didn't CREATE OR ALTER the review, raise an error
    RAISERROR ('You are not authorized to delete this review.', 16, 1);
END;
GO

--Retrieve top rated restaurants
SELECT r.RestaurantID, r.Name, AVG(rev.Rating) AS AverageRating
FROM Restaurants r
JOIN Reviews rev ON r.RestaurantID = rev.RestaurantID
GROUP BY r.RestaurantID, r.Name
ORDER BY AverageRating DESC;
GO

--Top rated restaurants for a specific cuisine
SELECT r.RestaurantID, r.Name, AVG(rv.Rating) AS AvgRating
FROM Restaurants r
JOIN Reviews rv ON r.RestaurantID = rv.RestaurantID
JOIN RestCuisines rc ON r.RestaurantID = rc.RestaurantID
JOIN Cuisines c ON rc.CuisineID = c.CuisineID
WHERE c.Name = @CuisineName
GROUP BY r.RestaurantID, r.Name
ORDER BY AvgRating DESC;
GO


--Cuisines

--Insert cuisines
CREATE OR ALTER PROCEDURE AddCuisine
    @Name NVARCHAR(50),
    @Description NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate Name
    IF LEN(ISNULL(@Name, '')) = 0
    BEGIN
        RAISERROR('Cuisine name is required.', 16, 1);
        RETURN;
    END

    -- Validate Description
    IF LEN(ISNULL(@Description, '')) = 0
    BEGIN
        RAISERROR('Cuisine description is required.', 16, 1);
        RETURN;
    END

    -- Check for existing cuisine name (unique constraint)
    IF EXISTS (SELECT 1 FROM Cuisines WHERE Name = @Name)
    BEGIN
        RAISERROR('Cuisine name already exists.', 16, 1);
        RETURN;
    END

    -- Insert cuisine
    INSERT INTO Cuisines (Name, Description)
    VALUES (@Name, @Description);
END;
GO

--Update cuisine details
CREATE OR ALTER PROCEDURE UpdateCuisine
    @CuisineID INT,
    @Name NVARCHAR(50),
    @Description NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR('Cuisine not found.', 16, 1);
        RETURN;
    END

    -- Validate Name
    IF LEN(ISNULL(@Name, '')) = 0
    BEGIN
        RAISERROR('Cuisine name is required.', 16, 1);
        RETURN;
    END

    -- Validate Description
    IF LEN(ISNULL(@Description, '')) = 0
    BEGIN
        RAISERROR('Cuisine description is required.', 16, 1);
        RETURN;
    END

    -- Check for duplicate name (excluding current cuisine)
    IF EXISTS (
        SELECT 1 FROM Cuisines 
        WHERE Name = @Name AND CuisineID != @CuisineID
    )
    BEGIN
        RAISERROR('Another cuisine with the same name already exists.', 16, 1);
        RETURN;
    END

    -- Perform update
    UPDATE Cuisines
    SET Name = @Name, Description = @Description
    WHERE CuisineID = @CuisineID;

    SELECT 'Cuisine updated successfully' AS Message;
END;
GO

--Delete a cuisine
CREATE OR ALTER PROCEDURE DeleteCuisine
    @CuisineID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if cuisine exists
    IF NOT EXISTS (SELECT 1 FROM Cuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR('Cuisine not found.', 16, 1);
        RETURN;
    END

    -- Optional: check if it's referenced anywhere (e.g., in RestCuisines)
    IF EXISTS (SELECT 1 FROM RestCuisines WHERE CuisineID = @CuisineID)
    BEGIN
        RAISERROR('Cannot delete: Cuisine is linked to restaurants.', 16, 1);
        RETURN;
    END

    -- Delete the cuisine
    DELETE FROM Cuisines WHERE CuisineID = @CuisineID;

    SELECT 'Cuisine deleted successfully' AS Message;
END;
GO

--Get all cuisines
SELECT CuisineID, Name, Description FROM Cuisines;
GO

--Get most popular cuisines
SELECT c.CuisineID, c.Name, COUNT(upc.UserID) AS PreferenceCount
FROM Cuisines c
JOIN UserPrefCuisines upc ON c.CuisineID = upc.CuisineID
GROUP BY c.CuisineID, c.Name
ORDER BY PreferenceCount DESC;
GO


--Payment

--Insert payment
CREATE OR ALTER PROCEDURE InsertPayment
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
    INSERT INTO Payments (ReservationID, Amount, PaymentDate, Status, Method)
    VALUES (@ReservationID, @Amount, GETDATE(), @Status, @Method);
END;
GO

--Payment history for a specific user
SELECT P.*
FROM Payments P
JOIN Reservations R ON P.ReservationID = R.ReservationID
WHERE R.UserID = @Userid
ORDER BY P.PaymentDate DESC;
GO

--Update Payment status
CREATE OR ALTER PROCEDURE UpdatePaymentStatus
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
GO

--Delete a payment record (admin)
DELETE FROM Payments WHERE PaymentID = @Paymentid;
GO

--Total revenue for a restaurant
SELECT R.RestaurantID, R.Name AS RestaurantName, SUM(P.Amount) AS TotalRevenue
FROM Payments P
JOIN Reservations Res ON P.ReservationID = Res.ReservationID
JOIN Tables T ON Res.TableID = T.TableID
JOIN Restaurants R ON T.RestaurantID = R.RestaurantID
WHERE P.Status = 'Completed' AND R.RestaurantID = @Restaurantid
GROUP BY R.RestaurantID, R.Name;
GO