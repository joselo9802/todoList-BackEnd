const { Schema, model } = require("mongoose");

const userTasksCategoriesSchema = new Schema({
    id_user: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
});

userTasksCategoriesSchema.methods.userTasksCategoryExists = async (id_user, category) => {
    const existence = await model("UserTasksCategories").find({id_user: id_user}).find({ category: category });
    return existence.length > 0;
  };

module.exports = model("UserTasksCategories", userTasksCategoriesSchema);