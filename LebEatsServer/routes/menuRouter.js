const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Menu = require('../models/menu');
const mRouter = express.Router();
mRouter.use(bodyParser.json());

mRouter.route('/')
    .get((req,res,next) => {
        Menu.find({})
            .then((platters) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(platters);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Menu.create(req.body)
            .then((platter) => {
                console.log('Platter Created ', platter);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(platter);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /platters');
    })
    .delete((req, res, next) => {
        Menu.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

mRouter.route('/:platterId')
    .get((req,res,next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(platter);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /platters/'+ req.params.platterId);
    })
    .put((req, res, next) => {
        Menu.findByIdAndUpdate(req.params.platterId, {
            $set: req.body
        }, { new: true })
            .then((platter) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(platter);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Menu.findByIdAndRemove(req.params.platterId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
mRouter.route('/:platterId/comments')
    .get((req,res,next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(platter.comments);
                }
                else {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null) {
                    platter.comments.push(req.body);
                    platter.save()
                        .then((platter) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(platter);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /platters/'
            + req.params.platterId + '/comments');
    })
    .delete((req, res, next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null) {
                    for (var i = (platter.comments.length -1); i >= 0; i--) {
                        platter.comments.id(platter.comments[i]._id).remove();
                    }
                    platter.save()
                        .then((platter) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(platter);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

mRouter.route('/:platterId/comments/:commentId')
    .get((req,res,next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null && platter.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(platter.comments.id(req.params.commentId));
                }
                else if (platter == null) {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /platters/'+ req.params.platterId
            + '/comments/' + req.params.commentId);
    })
    .put((req, res, next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null && platter.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        platter.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        platter.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    platter.save()
                        .then((platter) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(platter);
                        }, (err) => next(err));
                }
                else if (platter == null) {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Menu.findById(req.params.platterId)
            .then((platter) => {
                if (platter != null && platter.comments.id(req.params.commentId) != null) {
                    platter.comments.id(req.params.commentId).remove();
                    platter.save()
                        .then((platter) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(platter);
                        }, (err) => next(err));
                }
                else if (platter == null) {
                    err = new Error('Platter ' + req.params.platterId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = mRouter;