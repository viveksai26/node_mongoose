const express = require("express");
const cors = require("../cors");
const Favorite = require("../models/favorite");
var authenticate = require("../authenticate");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .then(
        (favorite) => {
          if (!favorite || favorite.length === 0) {
            Favorite.create({ user: req.user._id, dishes: req.body }).then(
              (fav) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(fav);
              },
              (err) => next(err)
            );
          } else {
            if (req.body !== null && req.body.length !== 0) {
              req.body.forEach((dish) => {
                if (favorite[0].dishes.indexOf(dish._id) === -1) {
                  favorite[0].dishes.push(dish._id);
                }
              });
            }
            favorite[0].save().then(
              (favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
              },
              (err) => next(err)
            );
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.remove({ user: req.user._id })
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .then((favorite) => {
        if (!favorite || favorite.length === 0) {
          Favorite.create({
            user: req.user._id,
            dishes: [req.params.dishId],
          }).then(
            (fav) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            },
            (err) => next(err)
          );
        } else {
          if (favorite[0].dishes.indexOf(req.params.dishId) === -1) {
            favorite[0].dishes.push(req.params.dishId);
          }
          favorite[0].save().then(
            (favorites) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            },
            (err) => next(err)
          );
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .then(
        (favorite) => {
          console.log(favorite);
          if (favorite && favorite.length !== 0) {
            if (favorite[0].dishes.indexOf(req.params.dishId) != -1) {
              favorite[0].dishes.splice(
                favorite[0].dishes.indexOf(req.params.dishId),
                1
              );
            }
            favorite[0].save().then(
              (favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
