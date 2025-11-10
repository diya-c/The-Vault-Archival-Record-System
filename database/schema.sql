-- Create Database
CREATE DATABASE IF NOT EXISTS archival_records_db;
USE archival_records_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Access;
DROP TABLE IF EXISTS ArchiveItem;
DROP TABLE IF EXISTS ItemType;
DROP TABLE IF EXISTS Collection;
DROP TABLE IF EXISTS Contributor;
DROP TABLE IF EXISTS User;

-- User Table (3NF - No transitive dependencies)
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ItemType Table (3NF)
CREATE TABLE ItemType (
    item_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    medium VARCHAR(50),
    description TEXT
) ENGINE=InnoDB;

-- Collection Table (3NF)
CREATE TABLE Collection (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(100),
    established_year INT,
    INDEX idx_collection_name (collection_name)
) ENGINE=InnoDB;

-- Contributor Table (3NF)
CREATE TABLE Contributor (
    contributor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255),
    affiliation VARCHAR(100),
    expertise VARCHAR(100),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contributor_name (name)
) ENGINE=InnoDB;

-- ArchiveItem Table (3NF with Foreign Keys)
CREATE TABLE ArchiveItem (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creation_date DATE,
    acquisition_date DATE,
    location VARCHAR(100),
    file_url VARCHAR(500),
    item_type_id INT NOT NULL,
    collection_id INT NOT NULL,
    contributor_id INT NOT NULL,
    added_by INT,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_type_id) REFERENCES ItemType(item_type_id) ON DELETE RESTRICT,
    FOREIGN KEY (collection_id) REFERENCES Collection(collection_id) ON DELETE RESTRICT,
    FOREIGN KEY (contributor_id) REFERENCES Contributor(contributor_id) ON DELETE RESTRICT,
    FOREIGN KEY (added_by) REFERENCES User(user_id) ON DELETE SET NULL,
    INDEX idx_title (title),
    INDEX idx_collection (collection_id),
    INDEX idx_type (item_type_id)
) ENGINE=InnoDB;

-- Access Table (3NF - Logs user access)
CREATE TABLE Access (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    user_id INT,
    accessor_name VARCHAR(100),
    access_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_type ENUM('view', 'download') NOT NULL,
    ip_address VARCHAR(45),
    FOREIGN KEY (item_id) REFERENCES ArchiveItem(item_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL,
    INDEX idx_item_access (item_id),
    INDEX idx_user_access (user_id),
    INDEX idx_access_date (access_date)
) ENGINE=InnoDB;

-- Insert Sample Data

-- Insert Item Types
INSERT INTO ItemType (type_name, medium, description) VALUES
('Article', 'Text', 'Written documents and articles'),
('Image', 'Visual', 'Photographs and visual media'),
('Video', 'Multimedia', 'Video recordings and documentaries');

-- Insert Collections
INSERT INTO Collection (collection_name, description, location, established_year) VALUES
('The Chola Empire', 'Collection of artifacts from the Chola Dynasty (9th-13th century)', 'Tamil Nadu, India', 850),
('The Hoysala Empire', 'Collection documenting the Hoysala Kingdom (10th-14th century)', 'Karnataka, India', 1000),
('The Mughal Empire', 'Archives from the Mughal Empire period (1526-1857)', 'Delhi, India', 1526);

-- Insert Contributors
INSERT INTO Contributor (name, contact_info, affiliation, expertise) VALUES
('Archaeological Survey of India', 'contact@asi.gov.in', 'Government of India', 'Ancient Indian History'),
('Indian National Trust for Art', 'info@intach.org', 'INTACH', 'Heritage Conservation'),
('Smithsonian Institution', 'archives@si.edu', 'Smithsonian', 'World History');

-- Insert Admin User (password: admin123)
INSERT INTO User (username, password, email, role) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'admin@archival.com', 'admin');

-- Insert Regular User (password: user123)
INSERT INTO User (username, password, email, role) VALUES
('user1', '$2a$10$YourHashedPasswordHere', 'user1@archival.com', 'user');

-- Insert Sample Archive Items for Chola Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('Chola Dynasty Historical Overview', 
 'Comprehensive article about the Chola Empire administrative structure and cultural achievements', 
 '2023-01-15', '2024-01-10', 'Chennai Museum',
 'https://example.com/articles/chola-history.pdf',
 1, 1, 1, 1),
('Brihadeeswarar Temple Architecture', 
 'High-resolution image of the Brihadeeswarar Temple built by Raja Raja Chola I', 
 '2023-03-20', '2024-02-15', 'Thanjavur',
 'https://example.com/images/brihadeeswara-temple.jpg',
 2, 1, 1, 1),
('Chola Bronze Sculptures Documentary', 
 'Video documentary showcasing the famous Chola bronze sculptures and their craftsmanship', 
 '2023-06-10', '2024-03-05', 'National Museum Delhi',
 'https://example.com/videos/chola-bronzes.mp4',
 3, 1, 2, 1);

-- Insert Sample Archive Items for Hoysala Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('Hoysala Architecture and Temples', 
 'Research article on distinctive Hoysala temple architecture featuring star-shaped platforms', 
 '2023-02-20', '2024-01-20', 'Belur Museum',
 'https://example.com/articles/hoysala-architecture.pdf',
 1, 2, 2, 1),
('Chennakesava Temple Sculpture', 
 'Detailed photograph of intricate sculptures at Chennakesava Temple, Belur', 
 '2023-04-15', '2024-02-20', 'Belur, Karnataka',
 'https://example.com/images/chennakesava-temple.jpg',
 2, 2, 2, 1),
('Hoysala Empire Historical Timeline', 
 'Educational video covering the rise and fall of the Hoysala Empire', 
 '2023-07-25', '2024-03-15', 'ASI Archives',
 'https://example.com/videos/hoysala-timeline.mp4',
 3, 2, 1, 1);

-- Insert Sample Archive Items for Mughal Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('Mughal Administrative System Study', 
 'Detailed article examining the Mansabdari system and administrative structure of the Mughal Empire', 
 '2023-03-10', '2024-01-25', 'National Archives India',
 'https://example.com/articles/mughal-administration.pdf',
 1, 3, 3, 1),
('Taj Mahal Construction Records', 
 'Historical image collection documenting the construction of the Taj Mahal', 
 '2023-05-08', '2024-02-28', 'Agra Museum',
 'https://example.com/images/taj-mahal-construction.jpg',
 2, 3, 3, 1),
('Mughal Empire: Rise and Glory', 
 'Documentary video exploring the cultural and military achievements of the Mughal Dynasty', 
 '2023-08-30', '2024-03-20', 'Smithsonian Archives',
 'https://example.com/videos/mughal-empire-glory.mp4',
 3, 3, 3, 1);

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

-- Create Views for Common Queries

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
```

### 1.2 Execute the SQL Script

**Option 1: Using MySQL Command Line**
```bash
mysql -u root -p < database/schema.sql
```

**Option 2: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `schema.sql`
4. Execute the script (Lightning bolt icon or Ctrl+Shift+Enter)

**Option 3: Using phpMyAdmin**
1. Open phpMyAdmin
2. Click "Import" tab
3. Choose `schema.sql` file
4. Click "Go"

---

## ⚙️ STEP 2: Backend Setup (Node.js + Express)

### 2.1 Initialize Backend
```bash
mkdir archival-records-system
cd archival-records-system
mkdir backend
cd backend
npm init -y
```

### 2.2 Install Backend Dependencies
```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv body-parser
npm install --save-dev nodemon
```

### 2.3 Create Backend Files

#### File: `backend/package.json`
Update the scripts section:
```json
{
  "name": "archival-backend",
  "version": "1.0.0",
  "description": "Backend for Archival Records System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}