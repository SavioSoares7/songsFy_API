const { Router } = require("express");
const singerRouter = Router();

const SingerControllers = require("../../controllers/SingerControllers");
const singerControllers = new SingerControllers();

singerRouter.post("/", singerControllers.create);
singerRouter.put("/:id", singerControllers.update);

module.exports = singerRouter;
