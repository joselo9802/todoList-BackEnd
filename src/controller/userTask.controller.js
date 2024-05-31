const userTaskCtrl = {};

const UserTasks = require("../models/userTask");
const User = require("../models/user");
const { JsonResponse } = require("../lib/JsonResponse");

userTaskCtrl.getUserTasks = async (req, res) => {
  const id_user = req.body.id_user;
  const userTasks = await UserTasks.find({ id_user: id_user });
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        tasks: userTasks,
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

userTaskCtrl.getUserTask = async (req, res) => {
  const userTask = await UserTasks.findById(req.params.id);
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        userTask: userTask,
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

userTaskCtrl.createUserTask = async (req, res) => {
  const { id_user, title, body, category, create_date, due_date, status } = req.body;
  const user = await User.find({ _id: id_user });
  if (!!!title || !!!body || !!!category || !!!due_date) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {
    if (user) {
      const newUserTask = new UserTasks({
        id_user,
        title,
        body,
        category,
        create_date,
        due_date,
        status
      });

      await newUserTask.save();

      const userUpdated = {
        names: user[0].names,
        lastNames: user[0].lastNames,
        username: user[0].username,
        password: user[0].password,
        tasksCategories: user[0].tasksCategories,
        tasks: await UserTasks.find({ id_user: id_user }),
      };

      await User.findByIdAndUpdate(user[0]._id, userUpdated);

      return res.status(200).json(
        JsonResponse(200, {
          status: 200,
          message: "User's task created successfuly",
        })
      );
    } else {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "Error in the process",
        })
      );
    }
  }
};

userTaskCtrl.updatedUserTask = async (req, res) => {
  const { id_user, title, body, category, due_date, status } = req.body;
  const user = await User.find({ _id: id_user });
  if (!!!title || !!!body || !!!category || !!!due_date) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {

    const userCurrentTask = await UserTasks.findById(req.params.id)

    await UserTasks.findByIdAndUpdate(req.params.id, {
      id_user,
      title,
      body,
      category,
      create_date: userCurrentTask.create_date,
      due_date,
      status: status ? status : userCurrentTask.status
    });

    const userUpdated = {
      names: user[0].names,
      lastNames: user[0].lastNames,
      username: user[0].username,
      password: user[0].password,
      tasksCategories: user[0].tasksCategories,
      tasks: await UserTasks.find({ id_user: id_user }),
    };

    await User.findByIdAndUpdate(user[0]._id, userUpdated);

    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        message: "User's task updated successfuly",
      })
    );
  }
};

userTaskCtrl.deletedUserTask = async (req, res) => {
  try {
    const id_user = req.body.id_user;
    await UserTasks.findByIdAndDelete(req.params.id);
    const user = await User.find({ _id: id_user });
    const userUpdated = {
      names: user[0].names,
      lastNames: user[0].lastNames,
      username: user[0].username,
      password: user[0].password,
      tasksCategories: user[0].tasksCategories,
      tasks: await UserTasks.find({ id_user: id_user }),
    };

    await User.findByIdAndUpdate(user[0]._id, userUpdated);

    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        message: "User's task deleted successfuly",
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

module.exports = userTaskCtrl;
