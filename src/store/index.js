import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        mutations
    },
    actions,
    plugins: [
        createPersistedState()
    ]
});
