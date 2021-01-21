import UserService from '@/services/user'

export  const getters = {
    users: state => state.users,

    currentPage: state => state.currentPage,
    pageCounts: state => state.pageCounts,


};


export const getDefaultState = () => ({
    users: [],
    user: {},
    currentPage: 1,
    itemPerPage: 20,
    pageCounts: 1,

})

const state = getDefaultState()

export  const actions = {

    async fetchPaging({ commit }, payload) {

      const currentPage = payload.page;
      const searchkey = payload.searchkey || null;

      const res = await UserService.fetchPaging(currentPage, searchkey);
      if(res.data){
        var data = res.data;
        commit("FETCH_PAGING", data);
      }
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
      state.users = data.data;
      state.pageCounts = data.pageCounts
    },


    UPDATE_CURRENT_PAGE(state, page){
      state.currentPage = page;
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
