const express = require("express")
const router = express.Router();
const validate = require("../middlewares/validate")
const schemas = require("../validations/Tasks")
const authenticate = require("../middlewares/authenticate")

const { create, update, deleteTask, makeComment, deleteComment, addSubTask, fetchTask } = require("../controllers/Tasks")

router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate,validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticate, deleteTask);

router.route("/:id/make-comment").post(authenticate,validate(schemas.commentValidation), makeComment);
router.route("/:id/commentId").delete(authenticate, deleteComment);

router.route("/:id/add-sub-task").post(authenticate,validate(schemas.createValidation), addSubTask);
router.route("/:id").get(authenticate, fetchTask);

module.exports = router;