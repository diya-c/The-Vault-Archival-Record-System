-- Stored Procedure: Get Items by Collection
DELIMITER //
CREATE PROCEDURE GetItemsByCollection(IN coll_id INT)
BEGIN
    SELECT 
        ai.item_id, ai.title, ai.description, ai.file_url,
        it.type_name, c.collection_name, con.name as contributor_name
    FROM ArchiveItem ai
    JOIN ItemType it ON ai.item_type_id = it.item_type_id
    JOIN Collection c ON ai.collection_id = c.collection_id
    JOIN Contributor con ON ai.contributor_id = con.contributor_id
    WHERE ai.collection_id = coll_id
    ORDER BY ai.added_date DESC;
END //
DELIMITER ;

-- Stored Procedure: Log Access
DELIMITER //
CREATE PROCEDURE LogAccess(
    IN p_item_id INT, 
    IN p_user_id INT, 
    IN p_accessor_name VARCHAR(100), 
    IN p_access_type VARCHAR(10)
)
BEGIN
    INSERT INTO Access (item_id, user_id, accessor_name, access_type)
    VALUES (p_item_id, p_user_id, p_accessor_name, p_access_type);
END //
DELIMITER ;

-- Function: Count Items by Type
DELIMITER //
CREATE FUNCTION CountItemsByType(type_id INT) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE item_count INT;
    SELECT COUNT(*) INTO item_count
    FROM ArchiveItem
    WHERE item_type_id = type_id;
    RETURN item_count;
END //
DELIMITER ;

-- Trigger: Update Access Log on Item View
DELIMITER //
CREATE TRIGGER after_item_insert
AFTER INSERT ON ArchiveItem
FOR EACH ROW
BEGIN
    INSERT INTO Access (item_id, user_id, accessor_name, access_type)
    VALUES (NEW.item_id, NEW.added_by, 
            (SELECT username FROM User WHERE user_id = NEW.added_by), 
            'view');
END //
DELIMITER ;