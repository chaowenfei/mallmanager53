import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '../components/users/users.vue'
import Rights from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Role
      }]
    }
  ]
})
export default router
// 在路由配置生效之前，统一判断token
// 路由/导航守卫
router.beforeEach((to, from, next) => {
  // to from next
  // to 要去哪的路由
  // from 当前的路由地址
  // next  放行，进入下一个组件
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登陆！')
      router.push({name: 'login'})
    } else {
      next()
    }
  }
})
