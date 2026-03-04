const router = require("express").Router();
const { searchAll } = require("../controllers/searchController");

router.get("/", searchAll);

module.exports = router;