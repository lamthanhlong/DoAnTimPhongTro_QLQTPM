export default {

  rootURL: '/user/',

  async update(id, data){
    try {
      return await axios.post(this.rootURL + `${id}`, data);
    } catch (error) {
      return error.response;
    }
  },




};
