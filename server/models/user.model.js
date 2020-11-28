const db = require('../utils/db');
const TableName = "Users";

module.exports = {
    GetAll: ()=>{
        return db.find(TableName);
    },
    GetPaginate: (start, limit)=>{
        return db.paginate(TableName, {}, {name: 1}, start, limit);
    },
    Add: (obj)=>{
        obj.created_date = obj.modified_date = new Date();
        return db.insertOne(TableName, obj);
    }
}