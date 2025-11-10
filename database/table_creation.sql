-- Create Database
CREATE DATABASE IF NOT EXISTS archival_records_db;
USE archival_records_db;

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

-- ItemType Table 
CREATE TABLE ItemType (
    item_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    medium VARCHAR(50),
    description TEXT
) ENGINE=InnoDB;

-- Collection Table
CREATE TABLE Collection (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(100),
    established_year INT,
    INDEX idx_collection_name (collection_name)
) ENGINE=InnoDB;

-- Contributor Table 
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

-- Access Table 
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
