const { create, index, login } = require("../controllers/Users")
const express = require("express")
const validate = require("../middlewares/validate")
const schemas = require("../validations/Users")


const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.loginValidation), login);

module.exports = router;