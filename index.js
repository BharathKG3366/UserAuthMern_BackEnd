const express = require("express");
const connectDb = require("./db");
const signinRouter = require("./routes/signin");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors({ origin: "*" }));
connectDb();

app.get("/", (req, res) => {
  res.send("hello world");
});

//app.get("/sayhi", (req, res) => {
//res.send("All is well")});//

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
