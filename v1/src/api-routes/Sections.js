const express = require("express")
const router = express.Router();
const validate = require("../middlewares/validate")
const schemas = require("../validations/Sections")
const authenticate = require("../middlewares/authenticate")

const { create, index, update, deleteSection} = require("../controllers/Sections")

router.route("/projectId").get(authenticate,index)
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate,validate(schemas.updateValidation),update );
router.route("/:id").delete(authenticate, deleteSection);

module.exports = router;