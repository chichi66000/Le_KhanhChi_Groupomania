
export const user = ({
    state: {
        user: {
            currentToken: "",
            currentId: "",
            currentUser: ""}
    },
    getter: {
        user: (state) => { return state.user}
    },
    mutations: {
        user (state, user) { state.user = user}
    },
    actions: {
        user (context, user) { context.commit('user', user)}
    },
    modules: {
    }
  })