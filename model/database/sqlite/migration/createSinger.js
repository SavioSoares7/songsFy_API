const singer = `
  CREATE TABLE IF NOT EXISTS singers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    nickname VARCHAR,
    email VARCHAR,
    password VARCHAR,
    avatar VARCHAR null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
  )
`;
module.exports = singer;
