const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Ratings';
const pagin = require('../configs/pagination.json');
module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  GetAllRatingByMotelId: async (id, params) => {
    const limit = parseInt(params.limit, 10) || pagin.default_pagination_items;
    params.limit = limit;
    if (params.offset) {
      params.skip = (params.offset - 1) * params.limit;
    }
    var aggregate = [];
    if (params.id) {
      aggregate.push({
        $match: {
          motel_id: `${id}`,
        },
      });
    }
    if (params.offset)
      aggregate.push({
        $skip: +params.skip,
      });
    if (params.limit)
      aggregate.push({
        $limit: +params.limit,
      });
    var returnObj = { data: await db.aggregate(TableName, aggregate) };
    if (params.limit && params.offset)
      returnObj.count = await db.count(TableName);
    else returnObj.count = returnObj.data.length;
    return returnObj;
  },
  FindRating: (obj) => {
    return db.find(TableName, {
      user_id: obj.user_id,
      motel_id: obj.motel_id,
    });
  },
  GetPaginate: (start, limit) => {
    return db.paginate(TableName, {}, { name: 1 }, start, limit);
  },
  Add: (obj) => {
    obj.created_date = obj.modified_date = new Date();
    return db.insertOne(TableName, obj);
  },
  Update: (id, obj) => {
    obj.modified_date = new Date();
    return db.updateOne(
      TableName,
      {
        _id: ObjectId(`${id}`),
      },
      obj
    );
  },
  Delete: (id) => {
    return db.deleteOne(TableName, { _id: ObjectId(`${id}`) });
  },
};
