-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;

-- Create the event
DELIMITER $$

CREATE EVENT ReleaseCapsulesEvent
ON SCHEDULE EVERY 1 MINUTE -- Adjust the interval as needed
DO
CALL CheckAndReleaseCapsules()$$

DELIMITER ;
