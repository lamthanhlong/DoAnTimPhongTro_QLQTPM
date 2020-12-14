const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Ratings';
const helper = require('../utils/helper');

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
    var query_object = {};

    if (id) {
      query_object.motel_id = `${id}`;
    }

    // pagination
    var {take, skip} = helper.calcPagination(currentPage, itemPerPage);

    console.log(take);

    var aggregate = [];
    if (id) {
      aggregate.push({
        $match: query_object,
      });
    }

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
