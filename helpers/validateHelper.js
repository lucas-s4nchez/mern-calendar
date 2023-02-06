const { check } = require("express-validator");
const { fieldValidators } = require("../middlewares/fieldValidators");
const User = require("../models/User");
const Event = require("../models/Event");
const bcrypt = require("bcryptjs");

const validateRegister = [
  check("name")
    .exists()
    .withMessage("El nombre es obligatorio")
    .not()
    .isEmpty(),
  check("email")
    .exists()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Email no válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject();
      }
    })
    .withMessage("Email ya se encuentra registrado"),

  check("password")
    .exists()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  //middleware que maneja los errores
  fieldValidators,
];
const validateLogin = [
  check("email")
    .exists()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Email no válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage("No existe un usuario con este email"),
  check("password")
    .exists()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .custom(async (value, { req, next }) => {
      const user = await User.findOne({ email: req.body.email });
      const validPassword = bcrypt.compareSync(value, user.password);
      if (!validPassword) {
        return Promise.reject();
      }
    })
    .withMessage("La contraseña es incorrecta"),
  //middleware que maneja los errores
  fieldValidators,
];
const validateCreateEvent = [
  check("title").not().isEmpty().withMessage("El título es obligatorio"),
  check("note").not().isEmpty().withMessage("La descripción es obligatoria"),
  check("start")
    .not()
    .isEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .custom((value, { req }) => {
      const currentDate = new Date().getTime();
      const startDate = new Date(value).getTime();
      const endDate = new Date(req.body.end).getTime();
      if (startDate < currentDate) {
        throw new Error("La fecha de inicio no es válida");
      }
      if (startDate >= endDate) {
        throw new Error(
          "La fecha de inicio de un evento no puede ser mayor o igual a la fecha de finalizacion del mismo"
        );
      }
      return true;
    }),
  check("end")
    .not()
    .isEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .custom((value, { req }) => {
      const currentDate = new Date().getTime();
      const endDate = new Date(value).getTime();
      if (endDate < currentDate) {
        throw new Error("La fecha de finalización no es válida");
      }
      return true;
    }),

  fieldValidators,
];
const validateUpdateEvent = [
  check("id", "No es un id válido").isMongoId(),
  check("title").not().isEmpty().withMessage("El título es obligatorio"),
  check("note").not().isEmpty().withMessage("La descripción es obligatoria"),
  check("start")
    .not()
    .isEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .custom(async (value, { req }) => {
      const eventId = req.params.id;
      const currentEvent = await Event.findById(eventId);
      const oldStartValue = new Date(currentEvent.start).getTime();
      const newStartValue = new Date(value).getTime();
      const endDate = new Date(req.body.end).getTime();

      if (newStartValue < oldStartValue) {
        throw new Error("La fecha de inicio no es válida");
      }
      if (newStartValue >= endDate) {
        throw new Error(
          "La fecha de inicio de un evento no puede ser mayor o igual a la fecha de finalizacion del mismo"
        );
      }
      return true;
    }),
  check("end")
    .not()
    .isEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .custom((value, { req }) => {
      const currentDate = new Date().getTime();
      const endDate = new Date(value).getTime();
      if (endDate < currentDate) {
        throw new Error("La fecha de finalización no es válida");
      }
      return true;
    }),
  fieldValidators,
];
const validateDeleteEvent = [
  check("id", "No es un id válido").isMongoId(),
  fieldValidators,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateEvent,
  validateUpdateEvent,
  validateDeleteEvent,
};
