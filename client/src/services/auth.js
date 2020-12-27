export default {

  rootURL: '/auth/',

  async login(data){
    try {
      return await axios.post(this.rootURL + 'login', data);
    } catch (error) {
      return error.response;
    }
  },

  async register(data)  {
    try {
      return await axios.post(this.rootURL + 'register', data);
    } catch (error) {
      return error.response;
    }
  },

  async logout(data) {
    try {
      const res = await axios.post(this.rootURL + 'logout', data);
      return res;
    } catch (error) {
      return error.response;
    }
  },


};
