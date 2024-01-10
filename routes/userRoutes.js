const express = require("express");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const router = express.Router();

const { registerUser, loginUser, currentUser } = require("../controllers/userController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateTokenHandler, currentUser);

module.exports = router;
