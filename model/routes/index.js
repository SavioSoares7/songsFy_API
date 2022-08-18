const { Router } = require("express");
const router = Router();

const singerRouter = require("./singer.routes");
const musicRouter = require("./music.routes");

router.use("/singer", singerRouter);
router.use("/music", musicRouter);

module.exports = router;
