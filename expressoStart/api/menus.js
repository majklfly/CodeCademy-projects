const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const menusRouter = express.Router();
const menuItemsRouter = require("./menu-items");

const validateFields = (req, res, next) => {
  req.title = req.body.menu.title;
  if (!req.title) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

menusRouter.param("menuId", (req, res, next, menuId) => {
  db.get(`SELECT * FROM Menu WHERE id=${menuId}`, (error, data) => {
    if (error) {
      next(error);
    } else if (data) {
      req.menu = data;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menusRouter.use("/:menuId/menu-items", menuItemsRouter);

menusRouter.get("/", (req, res, next) => {
  db.all(`SELECT * FROM Menu`, (error, data) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ menus: data });
    }
  });
});

menusRouter.post("/", validateFields, (req, res, next) => {
  db.run(`INSERT INTO Menus (title) VALUES ("${req.title}")`, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM menu WHERE id=${this.lastID}`, (error, data) => {
        if (error) {
          next(error);
        } else {
          res.status(201).json({ menu: data });
        }
      });
    }
  });
});

menusRouter.get("/:menuId", (req, res, next) => {
  res.status(200).json({ menu: req.menu });
});

menusRouter.put("/:menuId", (req, res, next) => {
  db.run(
    `UPDATE Menu SET title=${req.title} WHERE menu_id=${req.params.menuId}`,
    (error, data) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Menu WHERE menu_id${req.params.menuId}`,
          (error, data) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ menu: data });
            }
          }
        );
      }
    }
  );
});

menusRouter.delete("/:menuId", (req, res, next) => {
  db.run(`DELETE FROM Menu WHERE id = ${req.params.menuId}`, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = menusRouter;
