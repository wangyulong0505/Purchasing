import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loginInfo: {}
    },
    mutations: {
        _setLoginInfo(state, payload) {
            state.loginInfo = payload
        }
    },
    actions: {},
    modules: {}
})