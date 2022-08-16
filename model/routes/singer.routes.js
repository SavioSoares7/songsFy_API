const { Router } = require("express");
const singerRouter = Router();

singerRouter.post("/", (req, res) => {
  res.send("Cadastro de cantor");
});

module.exports = singerRouter;
