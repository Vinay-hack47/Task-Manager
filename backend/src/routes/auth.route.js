const express = require("express");
const router = express.Router();
const { signup, login, refresh, logout } = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const {signupSchema} = require("../utils/validation"); 

router.post("/signup", validate(signupSchema), signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;