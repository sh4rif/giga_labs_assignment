const express = require("express");
const router = express.Router();

const MovieController = require("../controllers/MovieController");

router.post("/", MovieController.store);
router.get("/", MovieController.index);
router.get("/:id", MovieController.show);
router.put("/:id", MovieController.update);
router.patch("/:id", MovieController.update);

module.exports = router;
