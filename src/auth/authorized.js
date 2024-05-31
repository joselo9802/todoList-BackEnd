const { JsonResponse } = require('../lib/JsonResponse');
const jwt = require('jsonwebtoken');
require("dotenv").config()

function authorized(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(403).json(
      JsonResponse(403, {
        error: "There's no Token",
      })
    );
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.id = userData.id
      return next()
    } catch (error) {
      res.status(403).json(
        JsonResponse(403, {
          error: "Unauthorized User",
        })
      );
    }
  }
}

module.exports = authorized;
