import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import 'assets/css/global.css'
// 导入字体图标
import 'assets/font/iconfont.css'
// 导入请求
import request from 'network/request'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

Vue.prototype.$http = request

// 全局过滤器
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
