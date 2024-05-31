const userCtrl = {};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");
const { JsonResponse } = require("../lib/JsonResponse");

userCtrl.getUsers = async (req, res) => {
  const users = await User.find();
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        data: users,
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

userCtrl.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        userData: {
          names: user.names,
          lastNames: user.lastNames,
          username: user.username,
          tasksCategories: user.tasksCategories,
          tasks: user.tasks,
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

userCtrl.createUser = async (req, res) => {
  const { names, lastNames, username, password } = req.body;
  if (!!!names || !!!lastNames || !!!username || !!!password) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {
    const userVerify = new User();
    const userExists = await userVerify.userExists(username);

    if (userExists) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "User already exits",
        })
      );
    } else {
      const newUser = new User({
        names,
        lastNames,
        username,
        password,
      });

      await newUser.save();

      return res.status(200).json(
        JsonResponse(200, {
          status: 200,
          message: "User created successfuly",
        })
      );
    }
  }
};

userCtrl.updatedUser = async (req, res) => {
  const { names, lastNames, username } = req.body;
  if (!!!names || !!!lastNames || !!!username) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {
    const userVerify = new User();
    const userExists = await userVerify.userExists(username);

    if (userExists) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "User already exits",
        })
      );
    } else {
      const currentUser = await User.findById(req.params.id);
      await User.findByIdAndUpdate(req.params.id, {
        names,
        lastNames,
        username,
        password: currentUser.password,
        tasksCategories: currentUser.tasksCategories,
        tasks: currentUser.tasks,
      });

      return res.status(200).json(
        JsonResponse(200, {
          status: 200,
          body: {
            _id: req.params.id,
            names,
            lastNames,
            username 
          },
          message: "User's information updated successfuly",
        })
      );
    }
  }
};

userCtrl.updatedUserPassword = async (req, res) => {
  const { password, newPassword, newPasswordRepeat } = req.body;
  const currentUser = await User.findById(req.params.id);
  const validateCurrentPassword = await currentUser.passwordCompare(password, currentUser.password);
  if (!!!password || !!!newPassword || !!!newPasswordRepeat) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {
    if (!validateCurrentPassword) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "Invalid passwords",
        })
      );  
    }

    if (newPassword !== newPasswordRepeat) {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "Invalid passwords",
        })
      );  
    }

    bcrypt.hash(newPassword, 10, async (error, hash) => {
      if (error) throw error;
      await User.findByIdAndUpdate(req.params.id, {
        names: currentUser.names,
        lastNames: currentUser.lastNames,
        username: currentUser.username,
        password: hash,
        tasksCategories: currentUser.tasksCategories,
        tasks: currentUser.tasks,
      });
    });

    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        body:{
          _id: currentUser._id,
          names: currentUser.names,
          lastNames: currentUser.lastNames,
          username: currentUser.username
        },
        message: "User's password updated successfuly",
      })
    );
  }
};

userCtrl.deletedUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        message: "User deleted successfuly",
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

userCtrl.validateUser = async (req, res) => {
  const { username, password } = req.body;
  if (!!!username || !!!password) {
    return res.status(400).json(
      JsonResponse(400, {
        status: 400,
        message: "All fields are required",
      })
    );
  } else {
    const userAccount = await User.findOne({ username });
    if (userAccount) {
      const userPassCompare = await userAccount.passwordCompare(
        password,
        userAccount.password
      );
      if (userPassCompare) {
        const token = await userAccount.createAccessToken({
          _id: userAccount._id,
          names: userAccount.names,
          lastNames: userAccount.lastNames,
        });

        return res.status(200).json(
          JsonResponse(200, {
            status: 200,
            body: {
              _id: userAccount._id,
              names: userAccount.names,
              lastNames: userAccount.lastNames,
              username: userAccount.username,
              tasksCategories: userAccount.tasksCategories
            },
            message: "Authenticated User",
            token: token,
          })
        );
      } else {
        return res.status(400).json(
          JsonResponse(400, {
            status: 400,
            message: "Invalid username or password",
          })
        );
      }
    } else {
      return res.status(400).json(
        JsonResponse(400, {
          status: 400,
          message: "User not found",
        })
      );
    }
  }
};

userCtrl.verifyUser = async (req, res) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json(
      JsonResponse(401, {
        message: "Unauthorized",
      })
    );
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
    if (error) {
      return res.status(401).json(
        JsonResponse(401, {
          message: "Unauthorized",
        })
      );
    }

    const userFound = await User.findById(user.id);

    if (!userFound) {
      return res.status(401).json(
        JsonResponse(401, {
          message: "Unauthorized",
        })
      );
    }

    return res.status(200).json(
      JsonResponse(200, {
        status: 200,
        body: {
          _id: userFound._id,
          names: userFound.names,
          lastNames: userFound.lastNames,
          username: userFound.username,
          tasksCategories: userFound.tasksCategories
        },
        message: "Authorized"
      })
    );
  });
};

module.exports = userCtrl;
