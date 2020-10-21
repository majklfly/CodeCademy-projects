const express = require("express");
const sqlite3 = require("sqlite3");
const timesheetsRouter = require("./timesheets");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const timesheetsRouter = require("./timesheets");

const employessRouter = express.Router();

const validateValues = (req, res, next) => {
  console.log(req.body);
  req.name = req.body.employee.name;
  req.position = req.body.employee.position;
  req.wage = req.body.employee.wage;
  req.is_current_employee = req.body.employee.is_current_employee === 0 ? 0 : 1;

  if (!req.name || !req.position || !req.wage) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

employessRouter.param("employeeId", (req, res, next, empId) => {
  db.get(`SELECT * FROM Employee WHERE id=${empId}`, (error, data) => {
    if (error) {
      next(error);
    } else if (data) {
      req.employee = data;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

employessRouter.use("/:employeeId/timesheet", timesheetsRouter);

employessRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Employee WHERE is_current_employee=1",
    (error, rows) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ employees: rows });
      }
    }
  );
});

employessRouter.post("/", validateValues, (req, res, next) => {
  db.run(
    `INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ("${req.name}", "${req.position}", ${req.wage}, ${req.is_current_employee})`,
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE id=${this.lastID}`,
          (error, row) => {
            if (error) {
              next(error);
            } else {
              res.send(201).json({ employee: row });
            }
          }
        );
      }
    }
  );
});

employessRouter.get("/:employeeId", (req, res, next) => {
  db.get(`SELECT * FROM Employee WHERE id=${req.employee}`, (error, data) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ employee: data });
    }
  });
});

employessRouter.put("/:employeeId", validateValues, (req, res, next) => {
  db.run(
    `UPDATE Employee SET name="${req.name}", position="${req.position}", wage=${req.wage}, is_current_employee=${req.is_current_employee}`,
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE id=${this.lastID}`,
          (error, row) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ employee: row });
            }
          }
        );
      }
    }
  );
});

employessRouter.delete("/:employeeId", (req, res, next) => {
  db.run(
    `UPDATE Employee SET is_current_employee = 0 WHERE id = ${req.params.employeeId}`,
    function (err) {
      if (err) {
        next(err);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE id = ${req.params.employeeId}`,
          (err, data) => {
            res.status(200).json({ employee: data });
          }
        );
      }
    }
  );
});

module.exports = employessRouter;
