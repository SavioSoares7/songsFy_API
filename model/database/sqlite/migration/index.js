const sqliteConnection = require("../../sqlite");
const createUser = require("./createUser");
const createMusic = require("./createMusic");

async function migrationRun() {
  const schemas = [createUser, createMusic].join("");
  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.log(error));
}

module.exports = migrationRun;
