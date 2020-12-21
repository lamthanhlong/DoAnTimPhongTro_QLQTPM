const motel = require('../models/motel.model');
const rating = require('../models/rating.model');
const local = require('../utils/local');
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
  },

  getLocals: (req, res) => {
    if (req.query.city_id && !req.query.district_id) {
      let districts = local.GetDistrict(req.query.city_id);
      return res.json({ count: districts.length, data: districts });
    } else if (req.query.city_id && req.query.district_id) {
      let wards = local.GetWard(req.query.city_id, req.query.district_id);
      return res.json({ count: wards.length, data: wards });
    } else {
      let cities = local.GetCity();
      for (k = 0; k < cities.length; k++) {
        cities[k].districts = local.GetDistrict(k + 1);
        for (t = 0; t < cities[k].districts.length; t++) {
          cities[k].districts[t] = local.GetWard(k + 1, t + 1);
        }
      }
      return res.json({ count: cities.length, data: cities });
    }
  },

  getDistrict: (req, res) => {
    const c_id = req.params.city_id;
    let districts = local.GetDistrict(c_id);
    if (req.query.wards) {
      for (k = 0; k < districts.length; k++) {
        var j = k + 1;
        districts[k].wards = local.GetWard(c_id, j);
      }
    }
    return res.json({ count: districts.length, data: districts });
  },
};
