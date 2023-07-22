const express = require("express");
const router = express.Router();
const {getAllClaps, createClap} =  require('../controllers/clapController');
const validateToken = require("../middleware/validateTokenHandler");

router.get("/allclaps", validateToken, getAllClaps);
router.post("/createclap", validateToken, createClap);

module.exports = router;