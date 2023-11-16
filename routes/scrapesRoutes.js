const express = require("express");
const { checkForOutOfStock } = require("../controllers/scrapesController");
const router = express.Router();

router.post("/check-out-of-stock", checkForOutOfStock);


module.exports = router;