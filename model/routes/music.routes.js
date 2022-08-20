const { Router } = require("express");
const musicRouter = Router();

const MusicControllers = require("../../controllers/MusicControllers");
const musicControllers = new MusicControllers();

musicRouter.post("/:user_id", musicControllers.create);
musicRouter.put("/:user_id", musicControllers.update);
musicRouter.delete("/:id", musicControllers.delete);
musicRouter.get("/", musicControllers.read);

module.exports = musicRouter;
