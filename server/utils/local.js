const fs = require('fs');

const local = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/local.json`, 'utf-8')
);

module.exports = {
  GetCity: () => {
    let cities = [];
    for (i in local) {
      let city = { id: local[i].id, name: local[i].name };
      cities.push(city);
    }
    return cities;
  },

  GetDistrict: (city_id) => {
    id = city_id - 1;
    districts = [];
    for (i in local[id].districts) {
      let district = {
        id: local[id].districts[i].id,
        name: local[id].districts[i].name,
        value: local[id].districts[i].name,
      };
      districts.push(district);
    }
    return districts;
  },
  GetWard: (city_id, district_id) => {
    c_id = city_id - 1;
    d_id = district_id - 1;
    wards = [];
    for (i in local[c_id].districts[d_id].wards) {
      let ward = {
        id: local[c_id].districts[d_id].wards[i].id,
        name: `${local[c_id].districts[d_id].wards[i].prefix} ${local[c_id].districts[d_id].wards[i].name}`,
        value: local[c_id].districts[d_id].wards[i].name,
      };
      wards.push(ward);
    }
    return wards;
  },
};
