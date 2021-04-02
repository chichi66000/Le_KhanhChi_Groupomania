
export const user = ({
    namespaced: true,
    state: {
            token: "",
            userId: "",
            currentUser: ""
    },
    // getter: {
    //     user: (state) => { return state.user}
    // },
    mutations: {
        getToken(state, token) {
            state.user.token = token
        },

        getUserId(state, id) {
            state.userId = id
        },

        getCurrentUser (state, user) {
            state.currentUser = user
        }
    },
    actions: {
        user (context, user) { context.commit('user', user)}
    },
    modules: {
    }
  })