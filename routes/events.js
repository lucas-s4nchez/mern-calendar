// Rutas de eventos
// host + api/events

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const {
  validateCreateEvent,
  validateUpdateEvent,
  validateDeleteEvent,
} = require("../helpers/validateHelper");
const { fieldValidators } = require("../middlewares/fieldValidators");
const { jwtValidator } = require("../middlewares/jwtValidator");
const router = Router();

//Validar todos los endpoints con el mismo middleware
router.use(jwtValidator);

router.get("/", getEvents);

router.post("/", validateCreateEvent, createEvent);

router.put("/:id", validateUpdateEvent, updateEvent);

router.delete("/:id", validateDeleteEvent, deleteEvent);

module.exports = router;
