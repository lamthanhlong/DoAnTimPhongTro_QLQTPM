const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Users';
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const constant = require('../configs/constant');
module.exports = {
  getSignedJwtToken: async (user_id) => {
    if (process.env.CHANGE_ID){
      user_id = "5fccb2931e10b0191c19ac6b";
    }
    const obj_query = {_id: process.env.IS_TEST ? user_id : ObjectId(`${user_id}`)};
    
    var users = await db.find(TableName, obj_query);
    
    if (users.length == 0) {
      return;
    } else{
      const user = users[0];
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
    }
  },
  /*GetAll: () => {
    return db.find(TableName);
  },*/
  GetQuery: async (params) => {
    var sort_object = {};
    if (params.sort) {
      var sort = params.sort.split('-');
      if (sort.length == 1) sort.push('asc');
      sort_object = JSON.parse(`{"${sort[0]}": ${sort[1] == 'asc' ? 1 : -1}}`);
    }

    var aggregate = [];
    var currentPage = params.page || 1;
    var itemPerPage = params.itemPerPage || constant.DEFAULT_PAGINATION_ITEMS;

    if (!helper.ObjectIsEmpty(sort_object))
      aggregate.push({
        $sort: sort_object,
      });
    
    if(params.searchkey){
      aggregate.push({$match: {phone: params.searchkey}});
    }  

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

    var countObject = {}
    if(params.searchkey) countObject = {phone: params.searchkey};
    
    var data = await db.aggregate(TableName, aggregate);
    var count = await db.count(TableName, countObject);
    var pageCounts = helper.calcPageCounts(count, itemPerPage);

    return {
      data,
      count,
      pageCounts,
    };
  },
  Single: (id) => {
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
