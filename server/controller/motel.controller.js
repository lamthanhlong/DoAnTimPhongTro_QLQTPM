const motel = require('../models/motel.model');
const rating = require('../models/rating.model');

const helper = require('../utils/helper');
var randomstring = require('randomstring');

module.exports = {
	fetchPaging: async (req, res) => {

		return res.json(await motel.GetQuery(req.query));
	},

	fetch: async (req, res) => {
		const id = req.params.id;
		var getRatings = await rating.GetAllRatingByMotelId(id, req.query);
		var data = await motel.Single(id);
		data[0].Ratings = getRatings;

		return res.json(data);
	},

	store: async (req, res) => {
		const object = req.body;
		const id = await motel.Add(object);
		object._id = id;
		object.rating_code = randomstring.generate();
		return res.status(201).json(object);
	},

	update: async (req, res) => {
		  const object = req.body;
		  object._id = null;
		  object.owner_id = null;
		  object.modified_date = null;
		  const id = req.params.id;
		  const update = await motel.Update(id, object);
		  if (update == 0) return res.status(400).end();
		  const newObj = await motel.Single(id);
		 return res.json(newObj);
	}
}