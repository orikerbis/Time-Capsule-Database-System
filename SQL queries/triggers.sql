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

CREATE TRIGGER after_received_capsules_insert
AFTER INSERT ON received_capsules
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action_type, capsule_id, timestamp)
    SELECT tc.user_id, 'delivered', NEW.capsule_id, NOW()
    FROM time_capsules tc
    WHERE tc.capsule_id = NEW.capsule_id;
END$$

DELIMITER ;
