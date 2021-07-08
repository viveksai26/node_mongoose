const express = require("express");

const Promotions = require('../models/promotions');

var authenticate = require('../authenticate');
const promoRouter = express.Router();

promoRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Promotions");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotions.remove({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


promoRouter
  .route("/:PromotionId")
  .get((req, res, next) => {
    Promotions.findById(req.params.PromotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /Promotion/  ${req.params.PromotionId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.PromotionId, {
      $set: req.body
  }, { new: true })
  .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
  }, (err) => next(err))
  .catch((err) => next(err));
  })
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
  Promotions.findByIdAndRemove(req.params.PromotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;
