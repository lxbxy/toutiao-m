import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
const TOKEN_KEY ='TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 用户的登录状态信息（读取出来是字符串，直接通过parse进行转换为对象）
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // user: null
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser(state,data) {
      state.user = data
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(stare.user))//localStorage只能存储字符串，所以通过stringify将user对象转换为字符串，再存储到localStorage
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
