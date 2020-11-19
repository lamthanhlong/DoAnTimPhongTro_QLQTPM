const config = require('../configs/db.json').mongodb;
const MongoClient = require('mongodb').MongoClient;


const connect = async (exec) => {
    try{
        var mongo = await MongoClient.connect(config.host);
        var val = exec(mongo.db(config.database));
        mongo.close();
        return val;
    }
    catch(ex)
    {
        console.log(ex);
        return null;
    }
};
const get_update_obj = (obj) => {
    var update_obj = { $set: {} };
    update_obj.$set = obj;
    return update_obj;
};
module.exports = {
    all: (table) => {
        return connect(async (db) => {
            return JSON.stringify(await db.collection(table).find({}).toArray());
        });
    },
    find: (table, obj) => {
        return connect(async (db) => {
            return JSON.stringify(await db.collection(table).find(obj).toArray());
        });
    },
    insertOne: (table, obj) => {
        return connect(async (db) => {
            return (await db.collection(table).insertOne(obj)).ops[0]._id;
        });
    },
    insertMany: (table, objs) => {
        return connect(async (db) => {
            return (await db.collection(table).insertMany(objs)).insertedCount;
        });
    },
    updateOne: (table, obj_query, obj_value) => {
        return connect(async (db) => {
            return (await db.collection(table).updateOne(obj_query, get_update_obj(obj_value))).modifiedCount;
        });
    },
    updateMany: (table, obj_query, obj_value) => {
        return connect(async (db) => {
            return (await db.collection(table).updateMany(obj_query, get_update_obj(obj_value))).modifiedCount;
        });
    },
    deleteOne: (table, obj) => {
        return connect(async (db) => {
            return (await db.collection(table).deleteOne(obj)).deletedCount;
        });
    },
    deleteMany: (table, objs) => {
        return connect(async (db) => {
            return (await db.collection(table).deleteMany(objs)).deletedCount;
        });
    }
}