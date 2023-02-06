const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User(req.body);

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Guardar en la db
    await user.save();

    //Generar JWT
    const token = jwt.sign(
      { uid: user.id, name: user.name },
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    //Generar JWT
    const token = jwt.sign(
      { uid: user.id, name: user.name },
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

const revalidateToken = (req, res) => {
  const uid = req.uid;
  const name = req.name;

  //Generar un jwt
  const token = jwt.sign(
    { uid: uid, name: name },
    process.env.SECRET_JWT_SEED,
    {
      expiresIn: "2h",
    }
  );

  res.json({
    ok: true,
    token: token,
  });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
};
