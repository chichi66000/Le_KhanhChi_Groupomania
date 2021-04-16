import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import  {user}    from './user'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  },
  plugins: [createPersistedState()]
})
