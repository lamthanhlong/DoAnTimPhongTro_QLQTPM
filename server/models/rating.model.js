const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Ratings';
const helper = require('../utils/helper');
const constant = require('../configs/constant');
const nodemon = require('nodemon');
const { config } = require('chai');

module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    if (process.env.IS_TEST) {
      id = '5fccb2931e10b0191c19ac6b';
    }
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  GetAllRatingByMotelId: async (id, params) => {
    let new_id = id;
    if (process.env.IS_TEST) {
      id = String('5fccb2931e10b0191c19ac6b');
    }
    var sort_object = JSON.parse(`{"created_date": -1}`);

    var aggregate = [
      {
        $match: {
          motel_id: ObjectId(`${id}`),
        },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'Users',
        },
      },
    ];
    if (!helper.ObjectIsEmpty(sort_object))
      aggregate.push({
        $sort: sort_object,
      });
    /*
    // pagination
    var currentPage = params.page || 1;
    var itemPerPage = params.itemPerPage || constant.DEFAULT_PAGINATION_ITEMS;

    // pagination
    var { limit, skip } = helper.calcPagination(currentPage, itemPerPage);
    aggregate.push(
      {
        $limit: limit,
      },
      {
        $skip: skip,
      }
    );*/
    var data = await db.aggregate(TableName, aggregate);
    return data;
  },
  FindRating: (obj) => {
    return db.find(TableName, {
      user_id: obj.user_id,
      motel_id: obj.motel_id,
    });
  },
  Add: (obj) => {
    obj.created_date = obj.modified_date = new Date();
    obj.user_id = ObjectId(`${obj.user_id}`);
    obj.motel_id = ObjectId(`${obj.motel_id}`);
    return db.insertOne(TableName, obj);
  },
  /*Update: (id, obj) => {
    obj.modified_date = new Date();
    if (process.env.IS_TEST) {
      return db.updateOne(TableName, { _id: id }, obj);
    }
    return db.updateOne(
      TableName,
      {
        _id: ObjectId(`${id}`),
      },
      obj
    );
  },*/
  Delete: (id) => {
    if (process.env.IS_TEST) {
      id = '5fccb2931e10b0191c19ac6b';
    }
    return db.deleteOne(TableName, { _id: ObjectId(`${id}`) });
  },
};
