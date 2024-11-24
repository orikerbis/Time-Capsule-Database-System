-- users table creation
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- time capsules table
CREATE TABLE `time_capsules` (
  `capsule_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `capsule_name` varchar(100) NOT NULL,
  `release_date` date NOT NULL,
  `release_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('scheduled','delivered','failed') NOT NULL DEFAULT 'scheduled',
  PRIMARY KEY (`capsule_id`),
  UNIQUE KEY `user_id` (`user_id`,`capsule_name`),
  CONSTRAINT `time_capsules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- capsule_contents table
CREATE TABLE `capsule_contents` (
  `content_id` int NOT NULL AUTO_INCREMENT,
  `capsule_id` int NOT NULL,
  `content_type` enum('text','image') NOT NULL,
  `content_data` longblob NOT NULL,
  `content_size` int NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`content_id`),
  KEY `capsule_id` (`capsule_id`),
  CONSTRAINT `capsule_contents_ibfk_1` FOREIGN KEY (`capsule_id`) REFERENCES `time_capsules` (`capsule_id`) ON DELETE CASCADE,
  CONSTRAINT `capsule_contents_chk_1` CHECK ((`content_size` <= 52428800))
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- shared_users table
CREATE TABLE `shared_users` (
  `shared_user_id` int NOT NULL AUTO_INCREMENT,
  `capsule_id` int NOT NULL,
  `shared_username` varchar(50) NOT NULL,
  PRIMARY KEY (`shared_user_id`),
  KEY `capsule_id` (`capsule_id`),
  CONSTRAINT `shared_users_ibfk_1` FOREIGN KEY (`capsule_id`) REFERENCES `time_capsules` (`capsule_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- received_capsules table
CREATE TABLE `received_capsules` (
  `received_id` int NOT NULL AUTO_INCREMENT,
  `capsule_id` int NOT NULL,
  `receiver_username` varchar(50) NOT NULL,
  `shared_by_username` varchar(50) NOT NULL,
  `content_id` int NOT NULL,
  `received_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`received_id`),
  UNIQUE KEY `capsule_receiver_unique` (`capsule_id`,`receiver_username`),
  KEY `capsule_id` (`capsule_id`),
  KEY `content_id` (`content_id`),
  CONSTRAINT `received_capsules_ibfk_1` FOREIGN KEY (`capsule_id`) REFERENCES `time_capsules` (`capsule_id`) ON DELETE CASCADE,
  CONSTRAINT `received_capsules_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `capsule_contents` (`content_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- audit_logs table
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `capsule_id` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  KEY `capsule_id` (`capsule_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_2` FOREIGN KEY (`capsule_id`) REFERENCES `time_capsules` (`capsule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

-- triggers 

DELIMITER $$

-- Trigger to delete time_capsules when user is deleted
CREATE TRIGGER delete_time_capsules
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    DELETE FROM time_capsules WHERE user_id = OLD.user_id;
END $$

-- Trigger to delete capsule_contents when time_capsules is deleted
CREATE TRIGGER delete_capsule_contents
AFTER DELETE ON time_capsules
FOR EACH ROW
BEGIN
    DELETE FROM capsule_contents WHERE capsule_id = OLD.capsule_id;
END $$

-- Trigger to delete shared_users when time_capsules is deleted
CREATE TRIGGER delete_shared_users
AFTER DELETE ON time_capsules
FOR EACH ROW
BEGIN
    DELETE FROM shared_users WHERE capsule_id = OLD.capsule_id;
END $$

DELIMITER ;

DELIMITER $$

-- Trigger to delete audit_logs when user is deleted
CREATE TRIGGER delete_audit_logs
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    DELETE FROM audit_logs WHERE user_id = OLD.user_id;
END $$

DELIMITER ;


DELIMITER $$

-- Trigger to create an entry in audit_logs when a new time capsule is created
CREATE TRIGGER after_time_capsule_insert
AFTER INSERT ON time_capsules
FOR EACH ROW
BEGIN
    -- Log the creation of a new time capsule
    INSERT INTO audit_logs (user_id, action_type, capsule_id)
    VALUES (NEW.user_id, 'created', NEW.capsule_id);
END $$

DELIMITER ;


DELIMITER $$

-- Trigger to log action when a new entry is added to shared_users
CREATE TRIGGER after_shared_users_insert
AFTER INSERT ON shared_users
FOR EACH ROW
BEGIN
    DECLARE related_user_id INT;
    DECLARE capsule_contents_count INT;
    DECLARE already_scheduled INT;

    -- Retrieve the user_id from the related time_capsules entry
    SELECT user_id INTO related_user_id
    FROM time_capsules
    WHERE capsule_id = NEW.capsule_id;

    -- If no matching time capsule exists, exit
    IF related_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No matching time capsule for shared_users entry';
    END IF;

    -- Check if a corresponding entry exists in the capsule_contents table
    SELECT COUNT(*) INTO capsule_contents_count
    FROM capsule_contents
    WHERE capsule_id = NEW.capsule_id;

    -- Check if "scheduled" is already logged
    SELECT COUNT(*) INTO already_scheduled
    FROM audit_logs
    WHERE capsule_id = NEW.capsule_id AND action_type = 'scheduled';

    -- Log "scheduled" only if:
    -- 1. There's an entry in capsule_contents, AND
    -- 2. "scheduled" has not already been logged
    IF capsule_contents_count > 0 AND already_scheduled = 0 THEN
        INSERT INTO audit_logs (user_id, action_type, capsule_id)
        VALUES (related_user_id, 'scheduled', NEW.capsule_id);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_received_capsules_insert
AFTER INSERT ON received_capsules
FOR EACH ROW
BEGIN
    -- Check if an entry for the action 'delivered' already exists for the capsule_id
    IF NOT EXISTS (
        SELECT 1
        FROM audit_logs
        WHERE capsule_id = NEW.capsule_id AND action_type = 'delivered'
    ) THEN
        -- Insert the log only if no existing 'delivered' log exists for this capsule_id
        INSERT INTO audit_logs (user_id, action_type, capsule_id, timestamp)
        SELECT tc.user_id, 'delivered', NEW.capsule_id, NOW()
        FROM time_capsules tc
        WHERE tc.capsule_id = NEW.capsule_id;
    END IF;
END$$

DELIMITER ;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

------------ procedure -----------
DELIMITER $$

CREATE PROCEDURE CheckAndReleaseCapsules()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE capsuleID INT;
    DECLARE userID INT;

    -- Declare a cursor for time capsules ready to be released
    DECLARE release_cursor CURSOR FOR
        SELECT tc.capsule_id, tc.user_id 
        FROM time_capsules AS tc
        WHERE CONCAT(tc.release_date, ' ', tc.release_time) <= NOW() 
        AND tc.status = 'scheduled';

    -- Declare a handler to exit the loop
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open the cursor
    OPEN release_cursor;

    -- Loop through all capsules that are ready to be released
    release_loop: LOOP
        FETCH release_cursor INTO capsuleID, userID;

        IF done THEN
            LEAVE release_loop;
        END IF;

        -- Process the capsule: Insert for creator (ensure no duplicates)
        INSERT IGNORE INTO received_capsules (capsule_id, receiver_username, shared_by_username, content_id, received_at)
        SELECT capsuleID, u.username, u.username, cc.content_id, NOW()
        FROM users u
        JOIN capsule_contents cc ON cc.capsule_id = capsuleID
        WHERE u.user_id = userID
        LIMIT 1;

        -- Process the capsule: Insert for shared users (ensure no duplicates)
        INSERT IGNORE INTO received_capsules (capsule_id, receiver_username, shared_by_username, content_id, received_at)
        SELECT capsuleID, su.shared_username, u.username, cc.content_id, NOW()
        FROM shared_users su
        JOIN users u ON u.user_id = userID
        JOIN capsule_contents cc ON cc.capsule_id = capsuleID
        WHERE su.capsule_id = capsuleID;

        -- Mark the capsule as delivered
        UPDATE time_capsules 
        SET status = 'delivered' 
        WHERE capsule_id = capsuleID;
    END LOOP;

    -- Close the cursor
    CLOSE release_cursor;
END$$

DELIMITER ;

--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------

-----event-----

-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;

-- Create the event
DELIMITER $$

CREATE EVENT ReleaseCapsulesEvent
ON SCHEDULE EVERY 1 MINUTE -- Adjust the interval as needed
DO
CALL CheckAndReleaseCapsules()$$

DELIMITER ;

------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

----------------------- codes used in frontend -------------------------------------

----- JOIN QUERIES -----

----- join query 1 -----
SELECT al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp,
             tc.capsule_name,
             GROUP_CONCAT(DISTINCT su.shared_username ORDER BY su.shared_username ASC) AS shared_usernames
      FROM audit_logs al
      LEFT JOIN time_capsules tc ON al.capsule_id = tc.capsule_id
      LEFT JOIN shared_users su ON al.capsule_id = su.capsule_id
      GROUP BY al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp, tc.capsule_name
      ORDER BY al.timestamp DESC

------ join query 2 ------
SELECT al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp,
             tc.capsule_name,
             GROUP_CONCAT(DISTINCT su.shared_username ORDER BY su.shared_username ASC) AS shared_usernames
      FROM audit_logs al
      LEFT JOIN time_capsules tc ON al.capsule_id = tc.capsule_id
      LEFT JOIN shared_users su ON al.capsule_id = su.capsule_id
      WHERE al.user_id = ?
      GROUP BY al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp, tc.capsule_name
      ORDER BY al.timestamp DESC

----- join query 3 -----
SELECT rc.received_id, rc.capsule_id, rc.shared_by_username, rc.received_at, tc.capsule_name
        FROM received_capsules rc
        LEFT JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
        WHERE rc.receiver_username = ?
        ORDER BY rc.received_at DESC

----- join query 4 -----
SELECT tc.capsule_id, tc.capsule_name, tc.status
      FROM users u
      INNER JOIN time_capsules tc ON u.user_id = tc.user_id
      WHERE u.username = ?

SELECT tc.capsule_id, tc.capsule_name, tc.status
      FROM received_capsules rc
      INNER JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
      WHERE rc.receiver_username = ?
--------------------------------------------------------------------------

------ aggregate query ------
SELECT COUNT(DISTINCT capsule_id) AS totalCount
      FROM (
        SELECT tc.capsule_id
        FROM users u
        INNER JOIN time_capsules tc ON u.user_id = tc.user_id
        WHERE u.username = ?
        UNION ALL
        SELECT tc.capsule_id
        FROM received_capsules rc
        INNER JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
        WHERE rc.receiver_username = ?
      ) AS combined_capsules

------- nested query -------
INSERT INTO shared_users (capsule_id, shared_username)
      SELECT ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM shared_users
        WHERE capsule_id = ? AND shared_username = ?
      )
      AND EXISTS (
        SELECT 1 FROM users
        WHERE username = ?
      )

------------------------------------------------

-- select and insert commands
SELECT * FROM users WHERE username = ?

SELECT capsule_id
      FROM time_capsules
      WHERE capsule_name = ? AND status = 'delivered'

SELECT content_type, TO_BASE64(content_data) AS content_data
      FROM capsule_contents
      WHERE capsule_id = ?

SELECT user_id FROM users WHERE username = ?
SELECT capsule_id FROM time_capsules WHERE capsule_name = ? AND user_id = ?
INSERT INTO capsule_contents (capsule_id, content_type, content_data, content_size)
         VALUES (?, 'image', ?, ?)

SELECT * FROM users WHERE email = ? OR username = ?
INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES (?, ?, ?, ?, ?)

SELECT user_id FROM users WHERE username = ?
SELECT * FROM time_capsules WHERE user_id = ? AND capsule_name = ?
INSERT INTO time_capsules (user_id, capsule_name, release_date, release_time, status)
       VALUES (?, ?, ?, ?, ?)

SELECT su.shared_username 
      FROM shared_users su 
      WHERE su.capsule_id = ?

SELECT t.capsule_id, t.capsule_name, t.release_date, t.release_time, t.status, u.first_name, u.last_name
      FROM time_capsules t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.capsule_name = ?

----- update command -----
SELECT user_id, password_hash FROM users WHERE username = ?
SELECT * FROM users WHERE username = ?
SELECT * FROM users WHERE email = ?
SELECT ${field} FROM users WHERE user_id = ?
UPDATE users SET ${field} = ? WHERE user_id = ?

----- delete command -----
DELETE FROM users WHERE username = ?

------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------

