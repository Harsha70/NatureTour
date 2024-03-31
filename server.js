const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./index");

const DB = process.env.DATABASE;
// console.log(DB);
// .replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log("DB connection established");
});

// console.log('env-->', app.get('env'), process.env);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("listening on port", port);
});
