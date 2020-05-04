import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import 'assets/css/global.css'
// 导入字体图标
import 'assets/font/iconfont.css'
// 导入请求
import request from 'network/request'

Vue.config.productionTip = false

Vue.prototype.$http = request

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
