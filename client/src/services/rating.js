export default {

  rootURL: '/rating/',

  async store(data){
    try {
      return await axios.post(this.rootURL, data);
    } catch (error) {
      return error.response;
    }
  },



};
