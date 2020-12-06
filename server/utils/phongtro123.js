var db = require("./db");

console.log("- Reading Json Files...");
var data = [];
for (i = 1; i <= 23; i++) {
    data = data.concat(require(`../../Crawler_PhongTro123/phongtro123_data/data_${i}.json`));
};

console.log("- Preparing Data...");
var motels = [];
var users = [];
var ListPhone = [];
var ListAddess = [];
for (item of data) {
    if (item.Title && item.Address && item.Owner && item.Phone && item.Area && item.Price && item.Description) {
        var now = new Date();
        if(ListPhone.indexOf(item.Phone) < 0){
            ListPhone.push(item.Phone);
            users.push({
                phone: item.Phone,
                password: '',
                name: item.Owner,
                address: item.Address,
                images: '',
                description: '',
                role: "MOTEL_OWNER",
                is_verified: false,
                modified_date: now,
                created_date: now
            });
        }
        if(ListAddess.indexOf(item.Address) < 0){
            ListAddess.push(item.Address);
            motels.push({
                title: item.Title,
                description: item.Description,
                address: item.Address,
                images: item.Imgs,
                area: parseInt(item.Area.replace("m²", "")),
                has_furniture: item.Description.toLowerCase().indexOf("nội thất") >= 0,
                price: parseFloat(item.Price.replace(" triệu/tháng", "")),
                is_verified: item.Imgs != "",
                rating: 0.0,
                owner_id: ListPhone.indexOf(item.Phone),
                rating_code: '',
                modified_date: now,
                created_date: now
            });
        }
    }
}

console.log("- Inserting Data to DataBase...");
Promise.all([
    db.createCollection("Users"),
    db.createCollection("Motels")
]).then(result=>{
    db.insertMany("Users", users).then(count1 => {
        console.log(count1 + " users is inserted.");
        db.find("Users").then(ListUser=>{
            for(item of motels){
                item.owner_id = ListUser[item.owner_id]._id;
            }
            db.insertMany("Motels", motels).then(count2 => {
                console.log(count2 + " motels is inserted.\n- Done!");
            });
        });
    });
});