var Campground  = require("../models/campground");
var Comment  = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function (err, foundCampground) {
			if (err) {
				req.flash("error", "Campground not found");
				res.redirect('back');
			} else {
				// does user own the campground?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function (err, foundCampground) {
			if (err) {
				res.redirect('back');
			} else {
				// does user own the comment?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj;