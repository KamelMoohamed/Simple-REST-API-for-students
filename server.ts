const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
