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

