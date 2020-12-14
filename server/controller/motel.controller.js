const model = require('../models/motel.model');
const helper = require('../utils/helper');
var randomstring = require('randomstring');

module.exports = {
	fetchPaging: async (req, res) => {

		return res.json(await model.GetQuery(req.query));
	},

	fetch: async (req, res) => {
		const id = req.params.id;
		var data = await model.Single(id);
		return res.json(data);
	},

	store: async (req, res) => {
		const object = req.body;
		const id = await model.Add(object);
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
		  const update = await model.Update(id, object);
		  if (update == 0) return res.status(400).end();
		  const newObj = await model.Single(id);
		 return res.json(newObj);
	}
}