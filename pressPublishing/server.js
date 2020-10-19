const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const express = require("express");

const apiRouter = require("./api/api");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(errorHandler);
app.use(cors);
app.use(morgan("dev"));
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;
