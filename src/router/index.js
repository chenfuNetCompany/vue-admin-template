import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account/table',
    name: '账号管理',
    meta: { title: '账号管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: '账号列表',
        component: () => import('@/views/account/index'),
        meta: { title: '账号列表', icon: 'table' }
      },
      {
        path: 'add',
        name: '添加账号',
        component: () => import('@/views/account/add'),
        meta: { title: '添加账号', icon: 'form' }
      }
    ]
  },

  {
    path: '/base',
    component: Layout,
    // redirect: '/course/table',
    name: '基础管理',
    meta: { title: '基础管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'coach',
        name: '教练管理',
        component: () => import('@/views/coach/index'),
        meta: { title: '教练管理', icon: 'table' }
      },
      {
        path: 'room',
        name: '场馆管理',
        component: () => import('@/views/room/index'),
        meta: { title: '场馆管理', icon: 'table' }
      },
      {
        path: 'banner',
        name: 'Banner管理',
        component: () => import('@/views/banner/index'),
        meta: { title: 'Banner管理', icon: 'table' }
      },
      {
        path: 'news',
        name: '新闻管理',
        component: () => import('@/views/news/index'),
        meta: { title: '新闻管理', icon: 'table' }
      },
    ]
  },

  {
    path: '/product',
    component: Layout,
    name: '产品管理',
    meta: { title: '产品管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'course',
        name: '课程管理',
        component: () => import('@/views/course/index'),
        meta: { title: '课程管理', icon: 'table' }
      },
      {
        path: 'ticket',
        name: '门票管理',
        component: () => import('@/views/course/index'),
        meta: { title: '门票管理', icon: 'table' }
      },
      {
        path: 'activity',
        name: '活动管理',
        component: () => import('@/views/course/index'),
        meta: { title: '活动管理', icon: 'table' }
      },
      {
        path: 'course/add',
        name: '添加产品',
        hidden: true,
        component: () => import('@/views/course/add'),
        meta: { title: '课程添加', icon: 'form' }
      },
    ]
  },

  {
    path: '/trade',
    component: Layout,
    redirect: '/trade/orders',
    name: '交易管理',
    meta: { title: '交易管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'orders',
        name: '订单列表',
        component: () => import('@/views/trade/orders'),
        meta: { title: '订单列表', icon: 'table' }
      },
      {
        path: 'refunds',
        name: '退款列表',
        component: () => import('@/views/trade/refunds'),
        meta: { title: '退款列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: '用户列表',
        component: () => import('@/views/customer/index'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'asset',
        name: '用户资产',
        component: () => import('@/views/customer/asset'),
        meta: { title: '用户资产', icon: 'table' }
      }
    ]
  },

  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/subject',
    name: '体测管理',
    meta: { title: '体测管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'subject',
        name: '项目管理',
        component: () => import('@/views/exam/subject'),
        meta: { title: '项目管理', icon: 'table' }
      },
      {
        path: 'table',
        name: '体测记录',
        component: () => import('@/views/exam/record'),
        meta: { title: '体测记录', icon: 'table' }
      },
    ]
  },

  {
    path: '/promotion',
    component: Layout,
    redirect: '/promotion/table',
    name: '营销管理',
    meta: { title: '营销管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'add',
        name: '创建优惠券',
        component: () => import('@/views/promotion/add'),
        meta: { title: '创建优惠券', icon: 'form' }
      },
      {
        path: 'table',
        name: '优惠券列表',
        component: () => import('@/views/promotion/index'),
        meta: { title: '优惠券列表', icon: 'table' }
      },
      {
        path: 'receive',
        name: '优惠券持有列表',
        component: () => import('@/views/promotion/receive'),
        meta: { title: '优惠券持有列表', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
