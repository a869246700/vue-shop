import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/common/login/Login'
import Home from 'views/home/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to：将要访问的路径
  // from：从哪一个路径跳转而来
  // next：是一个函数，表示放行，next()，next('/login') 表示强制跳转到路由 /login
  if (to.path === '/login') return next() // 表示访问/login时，放行
  const token = window.sessionStorage.getItem('token') // 获取token
  if (!token) return next('/login') // 判断token，如果没有token，强制跳转 /login
  next() // 放行
})

export default router
