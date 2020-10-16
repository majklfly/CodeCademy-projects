const meetingsRouter = require("express").Router();

module.exports = meetingsRouter;

const {
  getAllFromDatabase,
  createMeeting,
  addToDatabase,
  deleteAllFromDatabase,
} = require("./db");

meetingsRouter.get("/", (req, res, next) => {
  res.send(getAllFromDatabase("meetings"));
});

meetingsRouter.post("/", (req, res) => {
  const newMeeting = addToDatabase("meetings", createMeeting());
  res.status(201).send(newMeeting);
});

meetingsRouter.delete("/", (req, res) => {
  const deletedMeetings = deleteAllFromDatabase("meetings");
  if (deletedMeetings) {
    res.status(204).send();
  } else {
    res.status(500).send();
  }
});
