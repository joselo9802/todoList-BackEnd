const express = require("express");
const router = express.Router();
const authorized = require("../auth/authorized");

const {
    getUserTasksCategories,
    getUserTasksCategory,
    createUserTasksCategory,
    updatedUserTasksCategory,
    deletedUserTasksCategory 
} = require("../controller/userTasksCategories.controller")

router.post("/tasks/category", authorized, createUserTasksCategory);
router.post("/tasks/categories", authorized, getUserTasksCategories);
router.get("/tasks/category/:id", authorized, getUserTasksCategory);
router.put("/tasks/category/:id", authorized, updatedUserTasksCategory);
router.post("/tasks/category/:id", authorized, deletedUserTasksCategory);

module.exports =router;