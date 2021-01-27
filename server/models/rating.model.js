const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Ratings';
const helper = require('../utils/helper');
const constant = require('../configs/constant');
const nodemon = require('nodemon');
const { config } = require('chai');
const motel = require('./motel.model');

module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  GetAllRatingByMotelId: async (id) => {
    var sort_object = JSON.parse(`{"modified_date": -1}`);

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
    var data = await db.aggregate(TableName, aggregate);
    return data;
  },
  FindRating: (obj) => {
    return db.find(TableName, {
      user_id: ObjectId(`${obj.user_id}`),
      motel_id: ObjectId(`${obj.motel_id}`),
    });
  },
  Add: (obj) => {
    obj.created_date = obj.modified_date = new Date();
    obj.user_id = ObjectId(`${obj.user_id}`);
    obj.motel_id = ObjectId(`${obj.motel_id}`);
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
  UpdateMotelRatings: async (id) => {
    const ratings = await module.exports.GetAllRatingByMotelId(id);
    if (ratings.length > 0) {
      let avg = 0;
      for (i in ratings) {
        avg += ratings[i].rating;
      }
      avg = avg / ratings.length;
      return await motel.Update(id, { rating: avg });
    }
  },
};
