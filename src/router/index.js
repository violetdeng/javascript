import Vue from 'vue'
import VueRouter from 'vue-router'
import menuModule from '@/store/modules/menu'

const generateRoutesFromMenu = (routes = [], menus = []) => {
  if (menus.children) {
    return generateRoutesFromMenu(menus.children)
  }

  for (let i = 0; i < menus.length; i ++) {
    let item = menus[i]
    if (item.path) {
      routes.push(item)
    }
  }
}

Vue.use(VueRouter)

let routes = generateRoutesFromMenu(menuModule.state.current)

export default new VueRouter({
  routes
})
