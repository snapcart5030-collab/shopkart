const express = require("express");
const router = express.Router();

const {
  addVisitor,
  getVisitors
} = require("../controllers/visitorController");

router.post("/visit", addVisitor);
router.get("/visit", getVisitors);

module.exports = router;