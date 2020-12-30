const { ObjectId } = require('mongodb');
const db = require('../utils/db');
const TableName = 'Users';
const jwt = require('jsonwebtoken');
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
