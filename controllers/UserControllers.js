const sqliteConnection = require("../model/database/sqlite");
const { hash, compare } = require("bcryptjs");

class UserControllers {
  async create(req, res) {
    const database = await sqliteConnection();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ Error: "Please fill in all fields" });
    }

    const checkEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkEmail) {
      return res.status(500).json({ Error: "Existing email" });
    }

    const hashedPassword = await hash(password, 8);
    await database.run(
      "INSERT INTO users(name,email,password) VALUES (?,?,?)",
      [name, email, hashedPassword]
    );

    res.json();
  }
  async update(req, res) {
    const database = await sqliteConnection();

    const { name, email, password, old_password } = req.body;
    const { id } = req.params;

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    const checkEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (user.id !== checkEmail.id) {
      return res.json({ Error: "Email already used " });
    }
    if (password || old_password) {
      const checkPassword = await compare(old_password, user.password);
      if (!checkPassword) {
        return res.status(400).json({
          Error: "Passwords do not match",
        });
      }
      user.password = await hash(password, 8);
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await database.run(
      `
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?
        WHERE id = ?
    `,
      [user.name, user.email, user.password, id]
    );

    res.send({ user });
  }
  async read(req, res) {
    const database = await sqliteConnection();
    const allMusic = await database.all("SELECT * FROM music");

    const { name_music, name_singer } = req.query;

    if (name_music) {
      const musics = await database.all(`
        SELECT * FROM music WHERE song LIKE '%${name_music}%'
      `);
      return res.json(musics);
    }

    if (name_singer) {
      const singer = await database.get(
        `SELECT id FROM singers WHERE name like '%${name_singer}%' `
      );
      if (singer) {
        const musics = await database.all(
          `
        SELECT * FROM music WHERE id_singer = (?)
      `,
          [singer.id]
        );
        return res.json(musics);
      }

      const nickName = await database.get(
        `SELECT id FROM singers WHERE nickname like '%${name_singer}%'`
      );
      if (nickName) {
        const musics = await database.all(
          `
          SELECT * FROM music WHERE id_singer = (?)
        `,
          [nickName.id]
        );
        return res.json(musics);
      }
    }

    res.json({ allMusic });
  }
}
module.exports = UserControllers;
