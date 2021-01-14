export default {

  rootURL: '/user/',

   async fetch(id){
    try {
      return await axios.get(this.rootURL + `${id}`);
    } catch (error) {
      return error.response;
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
