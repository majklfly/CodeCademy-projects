const minionsRouter = require("express").Router();

module.exports = minionsRouter;

const e = require("express");
const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require("./db");

minionsRouter.param("minionId", (req, res, next, id) => {
  const minion = getFromDatabaseById("minions", id);
  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send();
  }
});

minionsRouter.get("/", (req, res, next) => {
  const values = getAllFromDatabase("minions");
  res.send(values);
});

minionsRouter.post("/", (req, rest, next) => {
  const newMinion = addToDatabase("minions", req.body);
  res.status(201).send(newMinion);
});

minionsRouter.get("/:minionId", (req, res, next) => {
  res.send(req.minion);
});

minionsRouter.put("/:minionId", (req, res, next) => {
  const updateMinion = updateInstanceIdDatabase("minions", req.body);
  res.send(updateMinion);
});

minionsRouter.delete("/:minionId", (req, res, next) => {
  const isDeleted = deleteFromDatabasebyId("minions", req.params.minionId);
  if (isDeleted) {
    res.status(204).send();
  } else {
    res.status(500).send();
  }
});
