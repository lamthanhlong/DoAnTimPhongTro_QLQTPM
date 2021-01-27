const helper = require('./helper');

const returnDefault = function(){
  return JSON.parse(process.env.TestReturnValue);
}
module.exports = {
  find: (table, obj_query) => {
    return returnDefault();
  },
  insertOne: (table, obj) => {
    return process.env.TestReturnValue;
  },
  insertMany: (table, objs) => {
    return returnDefault();
  },
  updateOne: (table, obj_query, obj_value) => {
    return returnDefault();
  },
  updateMany: (table, obj_query, obj_value) => {
    return returnDefault();
  },
  deleteOne: (table, obj) => {
    return returnDefault();
  },
  deleteMany: (table, objs) => {
    return returnDefault();
  },
  aggregate: (table, aggregate_array) => {
    return returnDefault();
  },
  count: (table, obj_query) => {
    return (returnDefault()).length;
  },
};
