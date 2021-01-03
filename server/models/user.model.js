const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Users';
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const constant = require('../configs/constant');
module.exports = {
  getSignedJwtToken: async (user_id) => {
    let users;
    if (!process.env.IS_TEST) {
      users = await db.find(TableName, {
        _id: ObjectId(`${user_id}`),
      });
    } else
      users = await db.find(TableName, {
        _id: user_id,
      });
    const user = users[0];
    if (users.length == 0) {
      return;
    } else
      return jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
  },
  GetAll: () => {
    return db.find(TableName);
  },
  GetQuery: async (params) => {
    var sort_object = {};
    if (params.sort) {
      var sort = params.sort.split('_');
      if (sort.length == 1) sort.push('asc');
      sort_object = JSON.parse(`{"${sort[0]}": ${sort[1] == 'asc' ? 1 : -1}}`);
    }

    var query_object = {};
    const reqQuery = params;
    const removeFields = ['sort', 'page', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);
    if (reqQuery.is_verified)
      reqQuery.is_verified = JSON.parse(reqQuery.is_verified);
    query_object = reqQuery;
    var aggregate = [];
    if (!helper.ObjectIsEmpty(query_object))
      aggregate.push({
        $match: reqQuery,
      });

    if (!helper.ObjectIsEmpty(sort_object))
      aggregate.push({
        $sort: sort_object,
      });
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
    );

    var data = await db.aggregate(TableName, aggregate);
    var count = await db.count(TableName, query_object);
    var pageCounts = helper.calcPageCounts(count, itemPerPage);

    return {
      data,
      count,
      pageCounts,
    };
  },
  Single: (id) => {
    if (process.env.IS_TEST) {
      return db.find(TableName, {
        _id: id,
      });
    }
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  FindByPhone: (phone) => {
    return db.find(TableName, { phone: phone });
  },
  Add: (obj) => {
    obj.created_date = obj.modified_date = new Date();
    return db.insertOne(TableName, obj);
  },
  Update: (id, obj) => {
    obj.modified_date = new Date();
    if (process.env.IS_TEST) {
      return db.updateOne(
        TableName,
        {
          _id: id,
        },
        obj
      );
    } else
      return db.updateOne(
        TableName,
        {
          _id: ObjectId(`${id}`),
        },
        obj
      );
  },
  Delete: (id) => {
    if (process.env.IS_TEST) {
      return db.deleteOne(TableName, { _id: id });
    } else return db.deleteOne(TableName, { _id: ObjectId(`${id}`) });
  },
};
