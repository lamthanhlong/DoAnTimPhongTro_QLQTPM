const { Console } = require('console');
const { promises } = require('fs');
const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Conversations';
let FindConversation = async (obj) => {
  const first = await db.find(TableName, {
    user_1: obj.user_1,
    user_2: obj.user_2,
  });
  const last = await db.find(TableName, {
    user_1: obj.user_2,
    user_2: obj.user_1,
  });
  if (first.length > 0) return first[0];
  if (last.length > 0) return last[0];
  return null;
};

module.exports = {
  GetAll: () => {
    return db.find(TableName);
  },
  Single: (id) => {
    return db.find(TableName, {
      _id: ObjectId(`${id}`),
    });
  },
  Append: async (sender, msg, receiver) => {
    const obj = {
      user_1: sender.userId,
      user_2: receiver.userId,
    };
    message = `${sender.userInfo}:${msg}`;
    let find = await FindConversation(obj);
    console.log(find);
    let con_id = '';
    if (find) {
      con_id = find._id;
      delete find_id;
      let new_msg = `${find.content};${message}`;
      find.content = new_msg;
      console.log(find);
      find.modified_date = new Date();
      await db.updateOne(
        TableName,
        {
          _id: con_id,
        },
        find
      );
    } else {
      obj.content = message;
      obj.created_date = obj.modified_date = new Date();
      con_id = await db.insertOne(TableName, obj);
    }
    console.log(`${sender.userInfo} sent message to ${receiver.userInfo}`);
    return db.find(TableName, {
      _id: ObjectId(`${con_id}`),
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
