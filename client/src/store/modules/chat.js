export  const getters = {

	windowMessengers: state => state.windowMessengers
};

export const getDefaultState = () => ({
    windowMessengers: [
        {   
            sender: {
                name: "Phong",
                id: "5fe867f253be3d1b3438842c",
            },
            isVisible: true,
            listMessengers: [
                {
                    userId: 1,
                    message: "hehehe",
                },
                {
                    userId: "5fe867f253be3d1b3438842c",
                    message: "cuoi cc",
                }
            ],

            messageInput: "",
        },
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
