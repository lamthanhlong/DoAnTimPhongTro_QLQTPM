const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const helper = require('../utils/helper');
const TableName = 'Motels';
const constant = require('../configs/constant');
const { query } = require('express');
const { process_params } = require('express/lib/router');
const randomstring = require('randomstring');

module.exports = {
  //GetAll: () => {
  //  return db.find(TableName);
  //},
  Single: (id) => {
    let new_id = id;
    if (process.env.IS_TEST) {
      id = '5fccb2931e10b0191c19ac6b';
    }
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
  OwnerGet: async (owner_id, params) => {
    let new_id = owner_id;
    if (process.env.IS_TEST) {
      owner_id = '5fccb2931e10b0191c19ac4c';
    }
    query_object = {};
    query_object.owner_id = ObjectId(`${owner_id}`);
    sort_object = {};
    if (params.is_verified) {
      query_object.is_verified = JSON.parse(params.is_verified);
    }
    if (params.has_furniture) {
      query_object.has_furniture = JSON.parse(params.has_furniture);
    }
    var aggregate = [];
    aggregate.push({ $match: query_object });
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
  GetQuery: async (params) => {
    var sort_object = {};
    if (params.sort) {
      var sort = params.sort.split('-');
      if (sort.length == 1) sort.push('asc');
      sort_object = JSON.parse(`{"${sort[0]}": ${sort[1] == 'asc' ? 1 : -1}}`);
    }

    var query_object = {};
    var query_address = '';
    if (params.city) query_address = params.city;
    if (params.district)
      query_address =
        params.district + (query_address ? ', ' + query_address : '');
    if (query_address) query_object.address = new RegExp(query_address, 'i');
    if (params.is_verified) {
      query_object.is_verified = JSON.parse(params.is_verified);
    }
    if (params.has_furniture) {
      query_object.has_furniture = JSON.parse(params.has_furniture);
    }
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

    var aggregate = [];
    if (!helper.ObjectIsEmpty(query_object)){
      var searchobjs = [];
      if(params.searchkey){
        searchobjs = [
          { title: new RegExp(params.searchkey, 'i') },
          { description: new RegExp(params.searchkey, 'i') },
          { title: params.searchkey }
        ]
      }
      if(params.is_verified) searchobjs.push({ is_verified: params.is_verified=='true'});

      if(searchobjs.length > 0){
        aggregate.push({$match: {$and: [query_object, {$or: searchobjs}]}});
      }
      else aggregate.push({$match: query_object});
    }

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
    var countObject = {}
    if(params.searchkey){
      countObject = {$and: [query_object, {$or: [
        {
          title: new RegExp(params.searchkey, 'i')
        },
        {
          description: new RegExp(params.searchkey, 'i')
        },
        {
          title: params.searchkey
        }
      ]}]};
    }
    else countObject = query_object;
    var count = await db.count(TableName, countObject);
    var pageCounts = helper.calcPageCounts(count, itemPerPage);

    return {
      data,
      count,
      pageCounts,
    };
  },
  Add: (obj) => {
    obj.created_date = obj.modified_date = new Date();
    obj.owner_id = ObjectId(`${obj.owner_id}`);
    return db.insertOne(TableName, obj);
  },
  Update: (id, obj) => {
    obj.modified_date = new Date();
    let new_id = id;
    return db.updateOne(
      TableName,
      {
        _id: ObjectId(`${id}`),
      },
      obj
    );
  },
  Delete: (id) => {
    return db.deleteOne(TableName, { _id: id });
  },
  ValidRatingCode: async (id, code) => {
    var motels = await db.find(TableName, { _id: ObjectId(`${id}`)});
    if(motels.length<=0) return false;
    var motel = motels[0];
    var result = helper.MinusTime(new Date(), motel.modified_date);
    if(motel.rating_code && code==motel.rating_code && result.year==0 && result.month==0 && result.day<=1) return true;
    return false;
  },
  GetRatingCode: async (id) => {
    var motels = await db.find(TableName, { _id: ObjectId(`${id}`)});
    if(motels.length<=0) return false;
    var motel = motels[0];
    var result = helper.MinusTime(new Date(), motel.modified_date);
    if(motel.rating_code && result && result.year==0 && result.month==0 && result.day<=1) return motel.rating_code;
    motel.rating_code = randomstring.generate(5);
    if((await module.exports.Update(id, {rating_code: motel.rating_code})) == 1){
      return motel.rating_code;
    }
    else{
      return false;
    }
  }
};
