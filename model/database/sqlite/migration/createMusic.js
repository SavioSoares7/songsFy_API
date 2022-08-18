const music = ` ;
  CREATE TABLE IF NOT EXISTS music(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song VARCHAR,
    id_singer INTEGER,
    launch VARCHAR, 
    likes INTEGER DEFAULT 0,
    feat VARCHAR,
    banner VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_singer)
    REFERENCES  singers(id)
  )
`;
module.exports = music;
