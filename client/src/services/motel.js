import helperCommon from '@/helpers/common';


export default {

  rootURL: '/motel/',

  async fetchPaging(currentPage, searchkey, price, city, district, area, filterPrice) {
    try {
      return  await axios.get(this.rootURL, {
        params: {
          page: currentPage,
          searchkey: searchkey,
          price: price,
          city: city,
          district: district,
          area: area,
          sort: filterPrice,
        }
      });
      return result;
    } catch (error) {
       return helperCommon.getError(error) || false; 
    }
  },

  async fetch(id) {
    try {
      return await axios.get(this.rootURL + `${id}`);
    } catch (error) {

       return helperCommon.getError(error) || false; 
    }
  },

  async store(form){
    try {
      return await axios.post(this.rootURL + `/store`, form);
    } catch (error) {
       return helperCommon.getError(error) || false; 
    }
  },

  async getDistricts(cityId)
  {
     try {
      return await axios.get(this.rootURL + `local`, {
        params: {
          city_id: cityId
        }
      });
    } catch (error) {

       return helperCommon.getError(error) || false; 
    }
  },

 async getWards(districtId, cityId)
  {
     try {
      return await axios.get(this.rootURL + `local`, {
        params: {
          district_id: districtId,
          city_id: cityId
        }
      });
    } catch (error) {

       return helperCommon.getError(error) || false; 
    }
  }

};
