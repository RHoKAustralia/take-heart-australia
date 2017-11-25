CREATE TABLE IF NOT EXISTS Corporate
    (
        CorporateId SERIAL PRIMARY KEY,
        ABN	INT,
        BusinessName VARCHAR(50) NOT NULL,
        BusinessAddress	VARCHAR(100),
        ContactFullName	VARCHAR(70) NOT NULL,
        ContactRole VARCHAR(35) NOT NULL,
        ContactPhone VARCHAR(100) NOT NULL,
        ContactEmail VARCHAR(64) NOT NULL,
        NumberOfPeople INT NOT NULL,
        IsYourSpace BIT NOT NULL,
        PreferredDate DATE NOT NULL,
        PreferredTime TIME NOT NULL
    );
	