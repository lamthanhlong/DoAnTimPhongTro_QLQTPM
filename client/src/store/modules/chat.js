export  const getters = {

	windowMessengers: state => state.windowMessengers
};

export const getDefaultState = () => ({
    windowMessengers: [
        {   
            item: {
                name: "Phong",
                id: 1,
            },
            isVisible: true,
            listMessengers: [
                {
                    userId: 1,
                    message: "hehehe",
                }
            ]
        },

        {
            item: {
                name: "Linh",
                id: 2,
            },
            isVisible: true,
            listMessengers: [
                {
                    userId: 1,
                    message: "hello",
                }
            ]
        }
    ],

})

const state = getDefaultState();

export  const actions = {

	openWindowMessenger({commit}, payload)
	{
		commit('OPEN_WINDOW_MESSENGER', payload);
	},

    updateWindowMessenger({commit}, payload)
    {

    },

    reset({commit}){
      commit('RESET')
    }
 }

export  const mutations = {

    OPEN_WINDOW_MESSENGER(state, data){
        console.log(data);
        return false;

      state.windowMessengers = data;
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
