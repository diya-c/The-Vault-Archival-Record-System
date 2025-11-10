-- Insert Item Types
INSERT INTO ItemType (type_name, medium, description) VALUES
('Article', 'Text', 'Written documents, books and articles'),
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
('admin', 'admin123', 'admin@archival.com', 'admin');

-- Insert Regular User (password: user123)
INSERT INTO User (username, password, email, role) VALUES
('user1', 'user123', 'user1@archival.com', 'user');

-- Insert Sample Archive Items for Chola Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('THE CHOLA TEMPLES', 
 '“A comprehensive illustrated study of the Chola-period temple architecture and sculpture of South India by C. Sivaramamurti.”', 
 '2023-01-15', '2024-01-10', 'Tamil Nadu',
 'https://archive.org/details/THECHOLATEMPLES/mode/2up',
 1, 1, 1, 1),
('Brihadeeswarar Temple Architecture', 
 'High-resolution image of the Brihadeeswarar Temple built by Raja Raja Chola I', 
 '2023-03-20', '2024-02-15', 'Thanjavur',
 'https://static.toiimg.com/thumb/107831376.jpg?imgsize=118098&photoid=107831376&width=600&height=335&resizemode=75',
 2, 1, 1, 1),
('Chola Bronze Sculptures Documentary', 
 'Video documentary showcasing the famous Chola bronze sculptures and their craftsmanship', 
 '2023-06-10', '2024-03-05', 'National Museum Delhi',
 'https://www.youtube.com/watch?v=CDGL3CaBp1c',
 3, 1, 2, 1);

-- Insert Sample Archive Items for Hoysala Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('Hoysala Architecture and Temples', 
 'Research article on distinctive Hoysala temple architecture featuring star-shaped platforms', 
 '2023-02-20', '2024-01-20', 'Belur',
 'https://www.worldhistory.org/article/898/hoysala-architecture/',
 1, 2, 2, 1),
('Chennakesava Temple Sculpture', 
 'Detailed photograph of intricate sculptures at Chennakesava Temple, Belur', 
 '2023-04-15', '2024-02-20', 'Belur, Karnataka',
 'https://inditales.com/wp-content/uploads/2019/11/sculpture-madanika-chennakeshava-temple-belur.jpg',
 2, 2, 2, 1),
('Hoysala Empire Historical Timeline', 
 'Educational video covering the rise and fall of the Hoysala Empire', 
 '2023-07-25', '2024-03-15', 'ASI Archives',
 'https://www.youtube.com/watch?v=k3LiaHZj6TE',
 3, 2, 1, 1);

-- Insert Sample Archive Items for Mughal Empire
INSERT INTO ArchiveItem (title, description, creation_date, acquisition_date, location, file_url, item_type_id, collection_id, contributor_id, added_by) VALUES
('Mughal Administrative System Study', 
 'Detailed article examining the Mansabdari system and administrative structure of the Mughal Empire', 
 '2023-03-10', '2024-01-25', 'National Archives India',
 'https://www.nextias.com/blog/mughal-administration/',
 1, 3, 3, 1),
('Taj Mahal', 
 'Image of the Taj Mahal', 
 '2023-05-08', '2024-02-28', 'Agra Museum',
 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Taj_Mahal_2%2C_Agra%2C_India.jpg',
 2, 3, 3, 1),
('Mughal Empire: Rise and Glory', 
 'Documentary video exploring the cultural and military achievements of the Mughal Dynasty', 
 '2023-08-30', '2024-03-20', 'History Archives',
 'https://www.youtube.com/watch?v=08rSAVl1Uoc',
 3, 3, 3, 1);