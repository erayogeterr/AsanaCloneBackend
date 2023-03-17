const express = require("express")
const router = express.Router();
const validate = require("../middlewares/validate")
const schemas = require("../validations/Projects")
const authenticate = require("../middlewares/authenticate")

const { create, index, update, deleteProject} = require("../controllers/Projects")

router.route("/").get(authenticate,index)
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").delete(authenticate, deleteProject);
router.route("/:id").patch(authenticate,validate(schemas.updateValidation),update );

module.exports = router;