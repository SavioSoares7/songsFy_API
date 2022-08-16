const { Router } = require("express");
const router = Router();

const singerRouter = require("./singer.routes");

router.use("/singer", singerRouter);

module.exports = router;
