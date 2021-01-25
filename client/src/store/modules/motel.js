import MotelService from '@/services/motel'

export  const getters = {
    motels: state => state.motels,
    motel: state => state.motel,

    currentPage: state => state.currentPage,
    pageCounts: state => state.pageCounts,


};


export const getDefaultState = () => ({
    motels: [],
    motel: {},
    currentPage: 1,
    itemPerPage: 20,
    pageCounts: 1,

})

const state = getDefaultState()

export  const actions = {

    async fetchPaging({ commit }, payload) {


      const currentPage = payload.page;
      const price = payload.price || null;
      const searchKey = payload.searchKey || null;
      const city = payload.city || null;
      const district = payload.district || null;
      const area = payload.area || null;
      const filterPrice = payload.sort || null;
      const isVerified = payload.isVerified;

      const res = await MotelService.fetchPaging(currentPage, searchKey, price, city, district, area, filterPrice, isVerified);
      if(res.data){
        var data = res.data;
        commit("FETCH_PAGING", data);
      }
    },

    async fetch({ commit }, payload) {
      const id = payload.id;
      const res = await MotelService.fetch(id);
      if(res.data){
        var data = res.data[0];
        commit("FETCH", data);
      }
    },

    async store ({commit}, payload)
    {
      const id = payload.id;
      const res = await MotelService.store(payload);
    },

    updateCurrentPage({commit}, payload)
    {
      commit("UPDATE_CURRENT_PAGE", payload.currentPage);
    },

    updateRatings({commit}, payload){
      commit("UPDATE_RATINGS", payload);
    },

    reset({commit}){
      commit('RESET')
    }
 }

export  const mutations = {

    FETCH_PAGING(state, data){
      state.motels = data.data;
      state.pageCounts = data.pageCounts
    },

    FETCH(state, motel){
      state.motel = motel;
      if(motel.Users) {
        state.motel.user = motel.Users[0]
        delete motel.Users;
      }
      if(motel.Ratings) {
        state.motel.ratings = motel.Ratings
        delete motel.Ratings;
      }
    },

    UPDATE_CURRENT_PAGE(state, page){
      state.currentPage = page;
    },

    UPDATE_RATINGS(state, ratings)
    {
      state.motel.ratings = ratings
    },

    DESTROY_MOTEL(){
      this.state.motel = {}
    },

    RESET(state){
      Object.assign(state, getDefaultState())
    }
}


export default{
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}
