import Vue from 'vue'
import VueRouter from 'vue-router'

// 分组，路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/common/login/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/childComp/Welcome')
const Users = () => import(/* webpackChunkName: "User_Rights_Roles" */ 'views/user/Users')
const Rights = () => import(/* webpackChunkName: "User_Rights_Roles" */ 'views/power/Rights')
const Roles = () => import(/* webpackChunkName: "User_Rights_Roles" */ 'views/power/Roles')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ 'views/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ 'views/goods/Params')
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ 'views/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ 'views/goods/Add')
const Order = () => import(/* webpackChunkName: "Order_Report" */ 'views/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'views/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
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
