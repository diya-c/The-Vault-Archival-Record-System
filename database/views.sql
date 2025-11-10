-- View: Items with full details (Join Query)
CREATE VIEW ItemsFullDetails AS
SELECT 
    ai.item_id,
    ai.title,
    ai.description,
    ai.creation_date,
    ai.acquisition_date,
    ai.location,
    ai.file_url,
    it.type_name,
    it.medium,
    c.collection_name,
    c.location as collection_location,
    con.name as contributor_name,
    con.affiliation,
    u.username as added_by_user
FROM ArchiveItem ai
JOIN ItemType it ON ai.item_type_id = it.item_type_id
JOIN Collection c ON ai.collection_id = c.collection_id
JOIN Contributor con ON ai.contributor_id = con.contributor_id
LEFT JOIN User u ON ai.added_by = u.user_id;

-- View: Access Statistics (Aggregate Query)
CREATE VIEW AccessStatistics AS
SELECT 
    ai.item_id,
    ai.title,
    COUNT(a.access_id) as total_accesses,
    COUNT(DISTINCT a.user_id) as unique_users,
    SUM(CASE WHEN a.access_type = 'view' THEN 1 ELSE 0 END) as view_count,
    SUM(CASE WHEN a.access_type = 'download' THEN 1 ELSE 0 END) as download_count,
    MAX(a.access_date) as last_accessed
FROM ArchiveItem ai
LEFT JOIN Access a ON ai.item_id = a.item_id
GROUP BY ai.item_id, ai.title;

-- Nested Query Example: Most Accessed Items
CREATE VIEW MostAccessedItems AS
SELECT 
    item_id,
    title,
    access_count
FROM (
    SELECT 
        ai.item_id,
        ai.title,
        (SELECT COUNT(*) FROM Access a WHERE a.item_id = ai.item_id) as access_count
    FROM ArchiveItem ai
) as item_access
WHERE access_count > 0
ORDER BY access_count DESC;
