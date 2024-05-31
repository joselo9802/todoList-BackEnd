const userTasksCategoriesCtrl = {};

const UserTasksCategories = require("../models/userTasksCategories");
const User = require("../models/user");
const UserTask = require("../models/userTask");
const { JsonResponse } = require("../lib/JsonResponse");

userTasksCategoriesCtrl.getUserTasksCategories = async (req, res) => {
  const id_user = req.body.id_user;
  const userCategories = await UserTasksCategories.find({ id_user: id_user });
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        categories: userCategories,
      })
    );
  } catch {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "Error in the process",
      })
    );
  }
};

userTasksCategoriesCtrl.getUserTasksCategory = async (req, res) => {
  const userCategory = await UserTasksCategories.findById(req.params.id);
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        tasksCategory: {
          id_user: userCategory.id_user,
          category: userCategory.category,
        },
      })
    );
  } catch {
    return res.status(400).json(
      JsonResponse(400, {
        message: "Error in the process",
      })
    );
  }
};

userTasksCategoriesCtrl.createUserTasksCategory = async (req, res) => {
  const { id_user, category } = req.body;
  const user = await User.find({ _id: id_user });
  if (!!!category) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "You have to write a category",
      })
    );
  } else {
    const userTasksCategoryVerify = new UserTasksCategories();
    const userTasksCategoryExists =
      await userTasksCategoryVerify.userTasksCategoryExists(id_user, category);

    if (userTasksCategoryExists) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "Tasks category already exits",
        })
      );
    } else {
      const newUserTasksCategory = new UserTasksCategories({
        id_user,
        category,
      });

      await newUserTasksCategory.save();

      const userTasksCategories = await UserTasksCategories.find({
        id_user: id_user,
      });

      const userTasksCategoriesFiltered = userTasksCategories.map((task) => ({
        _id: task._id,
        category: task.category,
      }));

      const userUpdated = {
        names: user[0].names,
        lastNames: user[0].lastNames,
        username: user[0].username,
        password: user[0].password,
        tasksCategories: userTasksCategoriesFiltered,
        tasks: user[0].tasks,
      };

      await User.findByIdAndUpdate(user[0]._id, userUpdated);

      return res.status(200).json(
        JsonResponse(200, {
          status: 200,
          body: {
            _id: user[0]._id,
            names: userUpdated.names,
            lastNames: userUpdated.lastNames,
            username: userUpdated.username,
            tasksCategories: userUpdated.tasksCategories,
          },
          message: "User's todo category created successfuly",
        })
      );
    }
  }
};

userTasksCategoriesCtrl.updatedUserTasksCategory = async (req, res) => {
  const { id_user, category } = req.body;
  const user = await User.find({ _id: id_user });
  const currentUserCategory = await UserTasksCategories.findById(req.params.id);
  if (!!!category) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "You have to write a category",
      })
    );
  } else {
    const userTasksCategoryVerify = new UserTasksCategories();
    const userTasksCategoryExists =
      await userTasksCategoryVerify.userTasksCategoryExists(id_user, category);

    if (userTasksCategoryExists) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "Task's category already exits",
        })
      );
    } else {
      await UserTasksCategories.findByIdAndUpdate(req.params.id, {
        id_user,
        category,
      });

      const userTasksCategories = await UserTasksCategories.find({
        id_user: id_user,
      });

      const userTasksCategoriesFiltered = userTasksCategories.map((task) => ({
        _id: task._id,
        category: task.category,
      }));

      const userTasks = await UserTask.find({
        id_user: id_user,
      }).find({category: currentUserCategory.category})

      for(let i = 0; i < userTasks.length; i++){
        const taskUpdated = {
          id_user: userTasks[i].id_user,
          category: category,
          title: userTasks[i].title,
          body: userTasks[i].body,
          create_date: userTasks[i].create_date,
          due_date: userTasks[i].due_date,
          status: userTasks[i].status
        }

        await UserTask.findByIdAndUpdate(userTasks[i]._id, taskUpdated)
      }

      const tasksUpdated = await UserTask.find({
        id_user: id_user,
      })

      const userUpdated = {
        names: user[0].names,
        lastNames: user[0].lastNames,
        username: user[0].username,
        password: user[0].password,
        tasksCategories: userTasksCategoriesFiltered,
        tasks: tasksUpdated
      };

      await User.findByIdAndUpdate(user[0]._id, userUpdated);

      return res.status(200).json(
        JsonResponse(200, {
          status: 200,
          body: {
            _id: user[0]._id,
            names: userUpdated.names,
            lastNames: userUpdated.lastNames,
            username: userUpdated.username,
            tasksCategories: userUpdated.tasksCategories,
          },
          message: "User's task category updated successfuly",
        })
      );
    }
  }
};

userTasksCategoriesCtrl.deletedUserTasksCategory = async (req, res) => {
  try {
    const id_user = req.body.id_user;
    const currentUserCategory = await UserTasksCategories.findById(req.params.id);
    await UserTasksCategories.findByIdAndDelete(req.params.id);
    
    const user = await User.find({ _id: id_user });

    const userTasksCategories = await UserTasksCategories.find({
      id_user: id_user,
    });

    const userTasksCategoriesFiltered = userTasksCategories.map((task) => ({
      _id: task._id,
      category: task.category,
    }));

    const userTasks = await UserTask.find({
      id_user: id_user,
    }).find({category: currentUserCategory.category})

    for(let i = 0; i < userTasks.length; i++){
      const taskUpdated = {
        id_user: userTasks[i].id_user,
        category: " - ",
        title: userTasks[i].title,
        body: userTasks[i].body,
        create_date: userTasks[i].create_date,
        due_date: userTasks[i].due_date,
        status: userTasks[i].status
      }

      await UserTask.findByIdAndUpdate(userTasks[i]._id, taskUpdated)
    }

    const tasksUpdated = await UserTask.find({
      id_user: id_user,
    })

    const userUpdated = {
      names: user[0].names,
      lastNames: user[0].lastNames,
      username: user[0].username,
      password: user[0].password,
      tasksCategories: userTasksCategoriesFiltered,
      tasks: tasksUpdated,
    };

    await User.findByIdAndUpdate(user[0]._id, userUpdated);

    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        body: {
          _id: user[0]._id,
          names: userUpdated.names,
          lastNames: userUpdated.lastNames,
          username: userUpdated.username,
          tasksCategories: userUpdated.tasksCategories,
        },
        message: "User's task category deleted successfuly",
      })
    );
  } catch {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "Error in the process",
      })
    );
  }
};

module.exports = userTasksCategoriesCtrl;
