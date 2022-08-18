const sqlConnection = require("../model/database/sqlite");

class MusicControllers {
  async create(req, res) {
    const database = await sqlConnection();

    const { user_id } = req.params;
    const { song, launch, feat, banner } = req.body;

    await database.run(
      `
      INSERT INTO music (song, id_singer,launch,feat,banner) 
      VALUES (?,?,?,?,?) 
    `,
      [song, user_id, launch, feat, banner]
    );

    res.json();
  }
  async update(req, res) {
    const database = await sqlConnection();

    const { user_id } = req.params;
    const { id, song, launch, feat, banner } = req.body;

    const music = await database.get("SELECT * FROM music WHERE id = (?)", [
      id,
    ]);
    console.log(user_id, music.id_singer);
    if (user_id != music.id_singer) {
      return res.status(500).json({
        Error: "Access denied",
      });
    }

    music.song = song ?? music.song;
    music.launch = launch ?? music.launch;
    music.feat = feat ?? music.feat;
    music.banner = banner ?? music.banner;

    await database.run(
      `
      UPDATE music SET
      song = ?,
      launch = ?,
      feat = ?,
      banner = ?
      WHERE id = ?
    `,
      [music.song, music.launch, music.feat, music.banner, id]
    );

    res.json(music);
  }
  async delete(req, res) {
    const database = await sqlConnection();

    const { id } = req.params;
    await database.run("DELETE FROM music WHERE id = (?)", [id]);

    res.json();
  }
}

module.exports = MusicControllers;
