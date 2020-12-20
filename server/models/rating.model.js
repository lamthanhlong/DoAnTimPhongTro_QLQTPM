const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Ratings';
const helper = require('../utils/helper');
const constant = require('../configs/constant');

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
     var aggregate = [{
      $match: {
        _id: ObjectId(`${id}`),
      },
    }, {
      $lookup: {
        from: 'Users',
        localField: 'owner_id',
        foreignField: '_id',
        as: 'Users',
      },
    } ];

    // pagination
    var currentPage = params.page || 1;
    var itemPerPage = params.itemPerPage || constant.DEFAULT_PAGINATION_ITEMS;

    // pagination
    var {limit, skip} = helper.calcPagination(currentPage, itemPerPage);
    aggregate.push(
      {
        $limit: limit,
      },
      {
         $skip: skip,
      }
    );

    var data =  await db.aggregate(TableName, aggregate)

    return data;
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
