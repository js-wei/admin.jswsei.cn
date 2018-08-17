import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mutations
  },
  actions,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
