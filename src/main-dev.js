import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入NProgress对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
    // 在request拦截器中，展示进度条
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use((config) => {
    // 在response拦截器中，隐藏进度条
    NProgress.done()
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function(originVal) {
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
}).$mount('#root')