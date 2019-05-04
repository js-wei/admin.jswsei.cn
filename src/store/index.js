/**
 * @Author: 魏巍
 * @Date:   2018-07-08T15:25:57+08:00
 * @Email:  524314430@qq.com
 * @Filename: index.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:08:36+08:00
 * @Copyright: free
 */

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
