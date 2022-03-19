const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
	{
		// store a single user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		// create an arary of favorite campsites for a single user
		campsites: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Campsite',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
