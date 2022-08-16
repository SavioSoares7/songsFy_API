const sqlConnection = require("../model/database/sqlite");
const { hash } = require("bcryptjs");

class SingerControllers {
  async create(req, res) {
    const database = await sqlConnection();
    const { name, nickname, email, password } = req.body;

    if (!name || !nickname || !email || !password) {
      return res.status(400).json({
        Error: "Please fill in all fields",
      });
    }

    const checkEmail = await database.get(
      "SELECT * FROM singers WHERE email = (?)",
      [email]
    );

    const checkNick = await database.get(
      "SELECT * FROM singers WHERE nickname = (?)",
      [nickname]
    );

    if (checkEmail || checkNick) {
      return res.status(400).json({
        Error: "Existing email or nickname",
      });
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      `
      INSERT INTO singers (name,nickname,email,password) VALUES (?,?,?,?)
    `,
      [name, nickname, email, hashedPassword]
    );
    res.json();
  }
  async update(req, res) {
    const { name, nickname, email, password, old_password, avatar } = req.body;
    const { id } = req.params;
    const { hash, compare } = require("bcryptjs");

    const database = await sqlConnection();

    const user = await database.get("SELECT * FROM singers WHERE id = (?)", [
      id,
    ]);

    const checkUser = await database.get(
      "SELECT * FROM singers WHERE id = (?)",
      [id]
    );
    const checkEmail = await database.get(
      "SELECT * FROM singers WHERE email = (?)",
      [email]
    );
    const checkNick = await database.get(
      "SELECT * FROM singers WHERE nickname = (?)",
      [nickname]
    );

    if (!checkUser) {
      return res.status(400).json({
        Error: "user not founds",
      });
    }
    if (checkEmail && checkEmail.id != user.id) {
      return res.status(400).json({
        Error: "Email already used",
      });
    }
    if (checkNick && checkNick.id != user.id) {
      return res.status(400).json({
        Error: "Nickname already used",
      });
    }
    if (password && !old_password) {
      return res.status(400).json({
        Error: "Fill in old password field",
      });
    }
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        return res.status(500).json({
          Error: "Passwords do not match",
        });
      }
      user.password = await hash(password, 8);
    }

    user.name = name ?? user.name;
    user.nickname = nickname ?? user.nickname;
    user.email = nickname ?? user.email;

    await database.run(
      `UPDATE singers SET
      name = ?,
      nickname = ?,
      email = ?,
      password = ?,
      avatar = ?
      WHERE id = ?`,
      [user.name, user.nickname, user.email, user.password, avatar, id]
    );
    res.json();
  }
}

module.exports = SingerControllers;
