import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER' // 用常量，写错了会报错，用字符串，读取localStorage失败，不会报错。
export default new Vuex.Store({
  state: {
    // 用户的登录状态信息
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))// user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      setItem(TOKEN_KEY, user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(user))
    }
  },
  actions: {},
  modules: {}
})
