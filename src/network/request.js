import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000
})
// 配置请求拦截器
instance.interceptors.request.use(config => {
  // 每次发送请求时，都在Authorization上挂载一个token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, err => {
  console.log(err)
})
// 配置响应拦截器
instance.interceptors.response.use(res => {
  return res
}, err => {
  console.log(err)
})

function post(url, config) {
  return instance.post(url, config)
}

function get(url, config) {
  return instance.get(url, config)
}

function put(url, config) {
  return instance.put(url, config)
}

function remove(url, config) {
  return instance.delete(url, config)
}

export default { get, post, put, remove }
