const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Conversations';

module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  FindConversation: (obj) => {
    const first = db.find(TableName, {
      user_1: obj.user_1,
      user_2: obj.user_2,
    });
    const last = db.find(TableName, {
      user_1: obj.user_2,
      user_2: obj.user_1,
    });
    if (first != null) return first;
    if (last != null) return last;
    return null;
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
