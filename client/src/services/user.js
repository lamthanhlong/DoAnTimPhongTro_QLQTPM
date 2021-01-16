export default {

  rootURL: '/user/',

   async fetch(id){
    try {
      return await axios.get(this.rootURL + `${id}`);
    } catch (error) {
      return error.response;
    }
  },

   async fetchPaging(currentPage) {

    try {
      return  await axios.get(this.rootURL, {
        params: {
          page: currentPage,
        }
      });
      return result;
    } catch (error) {
       return helperCommon.getError(error) || false; 
    }
  },

  async verifyUser(id, form){
    try {
      return await axios.put(this.rootURL + `${id}/verify`);
    } catch (error) {
       return helperCommon.getError(error) || false; 
    }
  },

  async update(id, data){
    try {
      return await axios.put(this.rootURL + `${id}`, data);
    } catch (error) {
      return error.response;
    }
  },




};
