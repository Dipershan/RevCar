const express = require("express");
const router = express.Router();
const { reportSOS } = require("../controllers/sos.controller");

router.post("/", reportSOS);

module.exports = router;
