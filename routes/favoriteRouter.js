const express = require('express');
const Campsite = require('../models/campsite');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

/**
 * Create the favorites router
 */
const favoriteRouter = express.Router();

/**
 * Setup end points for  favoriteRouter
 */

favoriteRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.populate('user')
			.populate('campsites')
			.then(favorites => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
			})
			.catch(err => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		// Try to find a document or records if this user has a favorite list
		Favorite.findOne({ user: req.user._id })
			//findONe methods passes the variable into the chained methods
			//in this case it will pass whatever it finds into the favoarite var
			.then(favorite => {
				//If user has a favorites list, then for each favorite in the body
				// check if the favorite already exisits if not add it.
				// On the front end this can be realized by user checking a bunch of
				// campsites on the same page and then hitting submit
				if (favorite) {
					req.body.forEach(fav => {
						if (!favorite.campsites.includes(fav._id)) {
							favorite.campsites.push(fav._id);
						}
					});
					// changes arent pushed to mongodb till you save the model.
					favorite
						.save()
						.then(favorite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							// send back the favorite models sto show all the favorites
							res.json(favorite);
						})
						.catch(err => next(err));
				} else {
					// if there is no document for the user you can create one
					// the campsites are an array in the request already
					Favorite.create({ user: req.user._id, campsites: req.body })
						.then(favorite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						})
						.catch(err => next(err));
				}
			})
			.catch(err => next(err));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /favorites');
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		// if a user doucment is found in mongodb you can deleteall campsites
		Favorite.findOneAndDelete({ user: req.user._id })
			.then(favorite => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorite);
			})
			.catch(err => next(err));
	});

favoriteRouter
	.route('/:campsiteId')
	// captures the campsitedId from URL
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	// get is not suppported since we cannot get a single favorite
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('GET operation not supported on /favorites/:id');
	})
	// Try to find a if the user has a favorites document
	// if true push the single campstie to the array
	// if false create a new document and push the single campsite
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		Favorite.findOne({ user: req.user._id }).then(favorite => {
			if (favorite) {
				if (!favorite.campsites.includes(req.params.campsiteId)) {
					favorite.campsites.push(req.params.campsiteId);
				}
				favorite
					.save()
					.then(favorite => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch(err => next(err));
			} else {
				Favorite.create({
					user: req.user._id,
					campsites: [req.params.campsiteId],
				})
					.then(favorite => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch(err => next(err));
			}
		});
	})
	// put is not supported
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /favorites');
	})
	// delete the single campsite. Use splice to delete
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then(favorite => {
				if (favorite) {
					const index = favorite.campsites.indexOf(req.params.campsiteId);
					if (index >= 0) {
						favorite.campsites.splice(index, 1);
					}
					favorite
						.save()
						.then(favorite => {
							Favorite.findById(favorite._id).then(favorite => {
								console.log('Remaining Favorites', favorite);
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(favorite);
							});
						})
						.catch(err => next(err));
				} else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
					res.end('Campsite not in favorites');
				}
			})
			.catch(err => next(err));
	});

module.exports = favoriteRouter;
