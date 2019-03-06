import { router } from '@/main'
import Layout from '@/layouts/DefaultLayout'
import lazyLoading from './lazyLoading'

const state = {
  current: [],
  default: [
    {
      title: '首页',
      path: '/',
      name: 'Home'
    }
  ],
  all: {
    administrator: []
  }
}

// getters
const getters = {
  currentMenu: state => state.current
}

// actions
const actions = {

  setMenu ({ commit }, { roles }) {
    commit('setMenu', roles)
  }

}

// mutations
const mutations = {

  setMenu (state, roles) {
    // 设置所有默认页面
    let m = [].concat(state.default)
    for (let r in state.all) {
      if (roles.indexOf(r) !== -1) {
        m = m.concat(m, state.all[r])
      }
    }
    // TODO 排序

    let routers = []
    let hasRoot = false

    function setRouters (m) {
      let pathes = []
      m.forEach((item) => {
        let menu = {
          ...item
        }
        if (menu.children) {
          item.pathes = setRouters(menu.children)
          return
        }
        if (menu.path === '/') hasRoot = true
        if (menu.name) menu.component = lazyLoading(menu.name)
        pathes.push(menu.path)
        routers.push(menu)
      })
      return pathes
    }

    setRouters(m)

    if (!hasRoot) {
      routers.push({
        path: '/',
        redirect: routers[0].path
      })
    }
    router.addRoutes([{
      path: '/',
      component: Layout,
      children: routers
    }])
    state.current = m
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
