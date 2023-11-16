const express = require("express");
const router = express.Router();
const {getAllClaps, createClap} =  require('../controllers/clapController');
const validateToken = require("../middleware/validateTokenHandler");

router.post("/clap/:id", validateToken, createClap);

module.exports = router;