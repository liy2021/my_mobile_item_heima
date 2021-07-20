import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './styles/index.less'
// 加载vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  // 路由对象注入到vue实例中，this就可以访问到$route，$router。原因不明。
  router,
  store,
  render: h => h(App)
}).$mount('#app')
