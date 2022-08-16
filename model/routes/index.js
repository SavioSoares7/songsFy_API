const { Router } = require("express");
const router = Router();

const singerRouter = require("./singer.routes");

router.use("/1/singer", singerRouter);

module.exports = router;
