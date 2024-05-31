const { Schema, model } = require("mongoose");

const userTaskSchema = new Schema({
  id_user: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  create_date: {
    type: Date
  },
  due_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String
  }
});

module.exports = model("UserTask", userTaskSchema);
