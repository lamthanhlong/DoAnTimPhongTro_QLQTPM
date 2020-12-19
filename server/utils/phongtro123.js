var db = require("./db");

var insertCrawlData = function () {
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
            if (ListPhone.indexOf(item.Phone) < 0) {
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
            if (ListAddess.indexOf(item.Address) < 0) {
                ListAddess.push(item.Address);
                var priceString = item.Price.split(' ')[0];
                if (item.Price.indexOf('đồng/tháng') >= 0) priceString = parseFloat(priceString.replace('.', '')) / 1000000;
                else priceString = parseFloat(priceString);
                motels.push({
                    title: item.Title,
                    description: item.Description,
                    address: item.Address,
                    images: item.Imgs,
                    area: parseInt(item.Area.replace("m²", "")),
                    has_furniture: item.Description.toLowerCase().indexOf("nội thất") >= 0,
                    price: priceString,
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
    ]).then(result => {
        db.insertMany("Users", users).then(count1 => {
            console.log(count1 + " users is inserted.");
            db.find("Users").then(ListUser => {
                for (item of motels) {
                    item.owner_id = ListUser[item.owner_id]._id;
                }
                db.insertMany("Motels", motels).then(count2 => {
                    console.log(count2 + " motels is inserted.\n- Done!");
                });
            });
        });
    });
}

var random = function(){
    return Math.floor(Math.random() * 100);
}

var insertDummyUserRating = function () {
    var users = [];
    const names = ['Nguyễn Minh Quân', 'Nguyễn Hiếu Trung Hòa', 'Phạm Quốc Phong', 'Nguyễn Minh Trí', 'Nguyễn Hữu Trọng', 'Trần Tiến Dũng', 'Lâm Thành Long']
    var now = new Date();
    for(i=0; i<7; i++){
        users.push({
            phone: '012345678' + i,
            password: '',
            name: names[i],
            address: 'https://github.com/lamthanhlong/DoAnTimPhongTro_QLQTPM',
            images: '',
            role: 'CUSTOMER',
            is_verified: true,
            description: 'This is a test user.',
            modified_date: now,
            created_date: now
        })
    }
    
    db.insertMany("Users", users).then(count => {
        console.log(count + " users is inserted.");
        Promise.all([
            db.find("Users", {role: 'CUSTOMER'}),
            db.aggregate("Motels", [{
                $limit: 10,
            }])
        ]).then(([users, motels]) =>{
            var rating = [];
            var index = 0;
            const comments = ['phòng trọ tiện nghi đầy đủ', 'phòng trọ đẹp như hình', 'phòng trọ sạch sẽ, giá tốt', 'phòng trọ tốt trong tầm giá', 'phòng trọ tạm được',
                            'chủ nhà thân thiện, nhiệt tình', 'hàng xóm thân thiện', 'hàng xóm toàn trai đẹp, gái xinh', 'chỗ trọ gần công viên', 'chỗ trọ thoáng mát'];
            for(m of motels){
                for(i=0; i<5; i++){
                    rating.push({
                        user_id: users[index%7]._id,
                        motel_id: m._id,
                        rating: random()%3 + 3,
                        comment: random()%2==0 ? comments[random()%10] + ', ' + comments[random()%10] + '.' : comments[random()%10] + '.',
                        modified_date: now,
                        created_date: now
                    });
                    i++;
                }
            }
            db.insertMany('Ratings', rating).then(count2 => {
                console.log(count2 + " ratings is inserted.\nDone!");
            })
        })
    });
}

insertDummyUserRating();