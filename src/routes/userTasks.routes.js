const express = require("express");
const router = express.Router();
const authorized = require("../auth/authorized");

const {
    getUserTasks,
    getUserTask,
    createUserTask,
    updatedUserTask,
    deletedUserTask 
} = require("../controller/userTask.controller")

router.post("/task", authorized, createUserTask);
router.post("/tasks", authorized, getUserTasks);
router.get("/task/:id", authorized, getUserTask);
router.put("/task/:id", authorized, updatedUserTask);
router.post("/task/:id", authorized, deletedUserTask);

module.exports = router;