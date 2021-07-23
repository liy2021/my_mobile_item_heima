import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由表
const routes = [{
  path: '/login',
  name: 'login',
  component: () =>
    import('@/views/login')
}, {
  path: '/',
  component: () =>
    import('@/views/layout'),
  // 子路由下面不是不让用/吗？
  // 好像不写“/”也行。真奇怪。
  children: [{
    path: '', // 留空，默认子路由。只能有一个。
    name: 'home',
    component: () =>
      import('@/views/home')
  }, {
    path: 'qa',
    name: 'qa',
    component: () =>
      import('@/views/qa')
  }, {
    path: 'video',
    name: 'video',
    component: () =>
      import('@/views/video')
  }, {
    path: 'my',
    name: 'my',
    component: () =>
      import('@/views/my')
  }]
}]

const router = new VueRouter({
  routes
})

export default router
