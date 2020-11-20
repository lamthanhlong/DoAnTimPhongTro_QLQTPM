const db = require('../utils/db');

module.exports = {
    GetAll: async ()=>{
        var x = await db.find("Users");
        //console.log(x);
        return x;
    },
    GetPaginate: async (start, limit)=>{
        var x = await db.paginate("Users", {}, {name: 1}, start, limit);
        //console.log(x);
        return x;
    }
}