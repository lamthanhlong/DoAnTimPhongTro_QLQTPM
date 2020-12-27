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
    if (getRatings.length > 0) {
      data[0].Ratings = getRatings;
    }
    return res.json(data);
  },
  ownerFetchMotels: async (req, res) => {
    const id = req.params.id;
    const motels = await motel.OwnerGet(id, req.query);
    return res.json(motels);
  },
  store: async (req, res) => {
    const object = req.body;
    const id = await motel.Add(object);
    object._id = id;
    object.rating_code = randomstring.generate();
    return res.status(201).json(object);
  },

  update: async (req, res) => {
    if (req.accessTokenPayload.role === 'MOTEL_OWNER') {
      const single = await motel.Single(req.params.id);

      if (single[0].owner_id != req.accessTokenPayload.id)
        return res
          .status(403)
          .json({ err_msg: 'User not have permission to edit' });
    }
    const object = req.body;
    delete object._id;
    delete object.owner_id;
    delete object.modified_date;
    const id = req.params.id;
    const update = await motel.Update(id, object);
    if (update == 0) return res.status(400).end();
    const newObj = await motel.Single(id);
    return res.json(newObj);
  },

  getLocals: (req, res) => {
    if (req.query.city_id && !req.query.district_id) {
      let districts = local.GetDistrict(req.query.city_id);
      for (k = 0; k < districts.length; k++) {
        districts[k].districts = local.GetWard(req.query.city_id, k + 1);
      }
      return res.json({ count: districts.length, data: districts });
    } else if (req.query.city_id && req.query.district_id) {
      let wards = local.GetWard(req.query.city_id, req.query.district_id);
      return res.json({ count: wards.length, data: wards });
    } else {
      let cities = local.GetCity();
      for (k = 0; k < cities.length; k++) {
        cities[k].districts = local.GetDistrict(k + 1);
        for (t = 0; t < cities[k].districts.length; t++) {
          cities[k].districts[t].wards = local.GetWard(k + 1, t + 1);
        }
      }
      return res.json({ count: cities.length, data: cities });
    }
  },
  delete: async (req, res) => {
    const motels = await motel.Single(req.params.id);
    const ratings = await rating.GetAllRatingByMotelId(
      req.params.id,
      req.query
    );
    if (ratings.length > 0) {
      for (const rate of ratings) {
        await rating.Delete(rate._id);
      }
    }
    const del = await motel.Delete(req.params.id);
    res.status(200).json({ success: 'true' });
  },
};
