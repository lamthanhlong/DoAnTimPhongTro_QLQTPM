const helper = require('./helper');

const GetDummyData = (TableName) => {
  switch (TableName) {
    case 'Motels':
      return require('../_data/Motels.json');
    case 'Users':
      return require('../_data/Users.json');
    case 'Ratings':
      return require('../_data/Ratings.json');
  }
};

const Find = (arr, item) => {
  var newArr = [];
  for (prop of Object.keys(item)) {
    for (i of arr) {
      if (
        i[prop] == item[prop] ||
        (item[prop].test && item[prop].test(i[prop]))
      )
        newArr.push(i);
    }
  }
  return newArr;
};

module.exports = {
  find: (table, obj_query) => {
    var dummyData = GetDummyData(table);
    if (typeof obj_query == 'undefined') {
      return dummyData;
    }
    if (!helper.ObjectIsEmpty(obj_query)) {
      dummyData = Find(dummyData, obj_query);
    }
    return dummyData;
  },
  insertOne: (table, obj) => {
    var dummyData = GetDummyData(table);
    return dummyData[dummyData.length - 1]._id + 1;
  },
  insertMany: (table, objs) => {
    var dummyData = GetDummyData(table);
    return dummyData.length + objs.length;
  },
  updateOne: (table, obj_query, obj_value) => {
    var dummyData = GetDummyData(table);
    return Find(dummyData, obj_query).length > 0 ? 1 : 0;
  },
  updateMany: (table, obj_query, obj_value) => {
    var dummyData = GetDummyData(table);
    return Find(dummyData, obj_query).length;
  },
  deleteOne: (table, obj) => {
    var dummyData = GetDummyData(table);
    return Find(dummyData, obj).length > 0 ? 1 : 0;
  },
  deleteMany: (table, objs) => {
    var dummyData = GetDummyData(table);
    var totaldelete = 0;
    for (obj of objs) {
      totaldelete += Find(dummyData, obj).length > 0 ? 1 : 0;
    }
    return totaldelete;
  },
  aggregate: (table, aggregate_array) => {
    return GetDummyData(table);
  },
  count: (table, obj_query) => {
    var dummyData = GetDummyData(table);
    return Find(dummyData, obj_query).length;
  },
};
