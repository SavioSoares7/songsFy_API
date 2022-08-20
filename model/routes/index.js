const { Router } = require("express");
const router = Router();

const singerRouter = require("./singer.routes");
const musicRouter = require("./music.routes");
const userRouter = require("./user.routes");

router.use("/singer", singerRouter);
router.use("/music", musicRouter);
router.use("/user", userRouter);

module.exports = router;
