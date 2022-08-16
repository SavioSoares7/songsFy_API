const sqlConnection = require("../model/database/sqlite");
const { hash } = require("bcryptjs");

class SingerControllers {
  async create(req, res) {
    const database = await sqlConnection();
    const { name, nickname, email, password } = req.body;

    if (!name || !nickname || !email || !password) {
      return res.status(500).json({
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
      return res.status(500).json({
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
    const { name, nickname, email, password, avatar } = req.body;
    const { id } = req.params;

    const database = await sqlConnection();

    const checkUser = await database.get(
      "SELECT * FROM singers WHERE id = (?)",
      [id]
    );
    res.json(checkUser);
  }
}

module.exports = SingerControllers;
