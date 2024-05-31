const app = require("./app");
require("./bd");
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
    console.log("The server is running")
})