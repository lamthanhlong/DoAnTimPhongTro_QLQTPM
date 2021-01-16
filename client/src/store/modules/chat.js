export  const getters = {

	windowMessengers: state => state.windowMessengers
};

export const getDefaultState = () => ({
    windowMessengers: [

    ],
})

const state = getDefaultState();

export  const actions = {

	openWindowMessenger({commit}, payload)
	{
		commit('OPEN_WINDOW_MESSENGER', payload);
	},

    reset({commit}){
      commit('RESET')
    }
 }

export  const mutations = {

    OPEN_WINDOW_MESSENGER(state, data){
        data.isVisible = true
        data.listMessengers = [];
        data.message = "";
        state.windowMessengers.push(data)
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
