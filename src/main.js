import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '@/App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

store.dispatch('setMenu', {
  roles: ['role']
})

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export { app, router, store }
