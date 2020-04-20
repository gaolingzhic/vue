import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
// import qs from 'qs'
import store from './store/index'
import echarts from 'echarts'
import 'echarts/map/js/china'
import moment from 'moment'
import BaiduMap from 'vue-baidu-map'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
// import AMap from 'vue-amap'
// 高德地图
// Vue.use(AMap)
// AMap.initAMapApiLoader({
//   key: '838af443e7f5cd17066b19c8cade8ce4',
//   plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
//   uiVersion: '1.0.11', // ui库版本，不配置不加载,
//   v: '1.4.4'
// })
// moment格式化时间，全局过滤器
Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
Vue.prototype.$echarts = echarts // for bubble theme
// 基于vue的富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)
// 百度地图
Vue.use(BaiduMap, {
  ak: 'advFVCQIfifpCnXsghZ3GbW29WGh9hNq'
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(ElementUI)
// 配置axios的基准地址
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Authorization'] = store.state.token
// 将ajax挂载到vue实例上
Vue.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // 判断是否存在token，如果存在将每个页面header都添加token
  if (store.state.token) {
    config.headers.common['Authorization'] = store.state.token.token
  }

  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.$store.commit('del_token')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }// 登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
