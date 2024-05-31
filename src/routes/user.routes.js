const express = require("express");
const router = express.Router();
const authorized = require("../auth/authorized");

const {
    getUsers,
    getUser,
    verifyUser,
    createUser,
    updatedUser,
    updatedUserPassword,
    deletedUser,
    validateUser
} = require("../controller/user.controller");


router.post("/signup", createUser);
router.post("/login", validateUser);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.get("/verify", verifyUser);
router.put("/user/:id", authorized, updatedUser);
router.put("/user/password/:id", authorized, updatedUserPassword);
router.post("/user/:id", authorized, deletedUser);

module.exports = router;