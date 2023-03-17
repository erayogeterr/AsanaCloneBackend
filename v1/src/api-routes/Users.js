const { create, index, login, projectList, resetPassword, update, deleteUser, changePassword } = require("../controllers/Users")
const express = require("express")
const validate = require("../middlewares/validate")
const schemas = require("../validations/Users")
const authenticate = require("../middlewares/authenticate")

const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/").patch(authenticate,validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenticate, projectList);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/change-password").post(authenticate ,validate(schemas.changePasswordValidation), changePassword);
router.route("/:id").delete(authenticate, deleteUser);

module.exports = router;