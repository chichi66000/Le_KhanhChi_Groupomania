
export const user = ({
    namespaced: true,
    state: { user: null}
,
    getter: {
        user: (state) => { return state.user}
    },
    mutations: {
        user ( state, user ) { 
            state.user = user
        }
    },
    actions: {
        user (context, user) { 
            context.commit('user', user)
        }
    }
  })