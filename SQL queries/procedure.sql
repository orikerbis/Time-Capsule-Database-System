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
