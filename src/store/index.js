import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    showHeader: true
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload
    },
    hideHeader (state) {
      state.showHeader = false
    }
  }
})
