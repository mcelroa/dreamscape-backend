const express = require("express");
const router = express.Router();

const {
    getAll,
    getById,
    create,
    update,
    remove
} = require("../controllers/dreams");
const { dreamById } = require("../middleware/dreams");
const { verifyToken } = require("../middleware/auth")

router.param("dreamId", dreamById)

router.get("/dreams", verifyToken, getAll);
router.get("/dreams/:dreamId", verifyToken, getById);

router.post("/dreams", verifyToken, create);

router.put("/dreams/:dreamId", verifyToken, update);

router.delete("/dreams/:dreamId", verifyToken, remove);

module.exports = router;