const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const helper = require('../utils/helper');
const TableName = 'Motels';
const constant = require('../configs/constant');

module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    var aggregate = [
      {
        $match: {
          _id: ObjectId(`${id}`),
        },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'owner_id',
          foreignField: '_id',
          as: 'Users',
        },
      },
    ];
    return db.aggregate(TableName, aggregate);
  },
  OwnerGet: (owner_id) => {
    var aggregate = [
      {
        $match: {
          owner_id: ObjectId(`${owner_id}`),
        },
      },
    ];
    return db.aggregate(TableName, aggregate);
  },
  GetQuery: async (params) => {
    var sort_object = {};
    if (params.sort) {
      var sort = params.sort.split('_');
      if (sort.length == 1) sort.push('asc');
      sort_object = JSON.parse(`{"${sort[0]}": ${sort[1] == 'asc' ? 1 : -1}}`);
    }

    var query_object = {};
    var query_address = '';
    if (params.city) query_address = params.city;
    if (params.district)
      query_address =
        'Quận ' + params.district + (query_address ? ', ' + query_address : '');
    if (query_address) query_object.address = new RegExp(query_address, 'i');
    if (params.area) {
      var range = params.area.split('-');
      if (range.length == 1) {
        query_object.area = { $gte: +range[0] };
      } else {
        query_object.area = {
          $gte: +range[0],
          $lte: +range[1],
        };
      }
    }
    query_object.price = {};
    if (params.price) {
      var range = params.price.split('-');
      if (range.length == 1) {
        query_object.price = { $gte: +range[0] };
      } else {
        query_object.price = {
          $gte: +range[0],
          $lte: +range[1],
        };
      }
    }
    // Not getting null prices
    query_object.price = Object.assign(query_object.price, { $ne: NaN });
    console.log(query_object.price);
    if (params.searchkey) {
      query_object.title = new RegExp(params.searchkey, 'i');
      query_object.description = new RegExp(params.searchkey, 'i');
    }
    var aggregate = [];
    if (!helper.ObjectIsEmpty(query_object))
      aggregate.push({
        $match: query_object,
      });

    console.log(aggregate);
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
    return db.deleteOne(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
};
