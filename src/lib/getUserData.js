
function getUserData(user){
    return {
        id: user._id,
        names: user.names,
        lastNames: user.lastNames,
        username: user.username,
        todosCategories: user.todosCategories,
        todos: user.todos
    }
}

module.exports = getUserData;