-- Table for characters
CREATE TABLE characters (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  nickname VARCHAR(100),
  link TEXT,
  royal BOOLEAN,
  kingsguard BOOLEAN,
  image_full TEXT,
  image_thumb TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for actors
CREATE TABLE actors (
  id INT PRIMARY KEY,
  character_id INT,
  name VARCHAR(100),
  link TEXT,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Table for seasons
CREATE TABLE seasons (
  id INT PRIMARY KEY,
  actor_id INT,
  count INT,
  FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

-- Table for houses
CREATE TABLE houses (
  id INT PRIMARY KEY,
  character_id INT,
  name VARCHAR(100),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Table for allies
CREATE TABLE allies (
  id INT PRIMARY KEY,
  character_id INT,
  ally_to INT,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (ally_to) REFERENCES characters(id) ON DELETE CASCADE
);

-- Table for actions
CREATE TABLE actions (
  id INT PRIMARY KEY,
  character_id INT,
  action_to INT,
  type ENUM('killed', 'served', 'guarded', 'abducted'),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (action_to) REFERENCES characters(id) ON DELETE CASCADE
);

-- Table for relationships
CREATE TABLE relationships (
  id INT PRIMARY KEY,
  character_id INT,
  relation_to INT,
  type ENUM('parent', 'sibling', 'married_engaged'),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (relation_to) REFERENCES characters(id) ON DELETE CASCADE
);