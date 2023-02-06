// Rutas de usuarios
// host + api/auth

const { Router } = require("express");
const router = Router();

const {
  validateRegister,
  validateLogin,
} = require("../helpers/validateHelper");

const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");
const { jwtValidator } = require("../middlewares/jwtValidator");

router.post("/register", validateRegister, createUser);

router.post("/", validateLogin, loginUser);

router.get("/renew", jwtValidator, revalidateToken);

module.exports = router;
