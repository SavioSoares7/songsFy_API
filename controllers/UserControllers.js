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
    const music = await database.all("SELECT * FROM music");

    res.json({ music });
  }
}
module.exports = UserControllers;
