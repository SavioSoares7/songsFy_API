const sqliteConnection = require("../../sqlite");

const createSinger = require("./createSinger");
const createMusic = require("./createMusic");
const createUser = require("./createUser");

async function migrationRun() {
  const schemas = [createSinger, createMusic, createUser].join("");
  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.log(error));
}

module.exports = migrationRun;
