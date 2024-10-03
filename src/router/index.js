import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Reset from '../components/Reset'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'
import Product from '../pages/product/ManageProduct'
import CreateProduct from '../pages/product/CreateProduct'
import Series from '../pages/series/ManageSeries'
import CreateSeries from '../pages/series/CreateSeries'
import Location from '../pages/location/ManageLocation'
import CreateLocation from '../pages/location/CreateLocation'
import Account from '../pages/account/ManageAccount'
import CreateAccount from '../pages/account/CreateAccount'
import Material from '../pages/material/ManageMaterial'
import CreateMaterial from '../pages/material/CreateMaterial'
import UpdateMaterial from '../pages/material/UpdateMaterial'
import Glass from '../pages/glass/ManageGlass'
import CreateGlass from '../pages/glass/CreateGlass'
import UpdateGlass from '../pages/glass/UpdateGlass'


import store from '../store/store'

Vue.use(Router)


let routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/register',
    component: Register,
    meta: { title: 'Register' }
  },
  {
    path: '/reset-password',
    component: Reset,
    meta: { title: 'Reset Password' }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { title: 'Profile' }
  },
  {
    path: '*',
    meta: { title: 'Page Not Found' },
    component: NotFound
  },
  {
    path: '/',
    redirect: '/product'
  },
  {
    path: '/product',
    meta: { title: 'Product' },
    component: Product
  },
  {
    path: '/product/edit/:id',
    meta: { title: 'Edit Product' },
    component: CreateProduct
  },
  {
    path: '/product/create',
    meta: { title: 'Create Product' },
    component: CreateProduct
  },
  {
    path: '/series',
    meta: { title: 'Series' },
    component: Series
  },
  {
    path: '/series/edit/:id',
    meta: { title: 'Edit Series' },
    component: CreateSeries
  },
  {
    path: '/series/create',
    meta: { title: 'Create Series' },
    component: CreateSeries
  },
  {
    path: '/location',
    meta: { title: 'Location' },
    component: Location
  },
  {
    path: '/location/edit/:id',
    meta: { title: 'Edit Location' },
    component: CreateLocation
  },
  {
    path: '/location/create',
    meta: { title: 'Create Location' },
    component: CreateLocation
  },
  {
    path: '/account',
    meta: { title: 'Account' },
    component: Account
  },
  {
    path: '/account/edit/:id',
    meta: { title: 'Edit Account' },
    component: CreateAccount
  },
  {
    path: '/account/create',
    meta: { title: 'Create Account' },
    component: CreateAccount
  },
  {
    path: '/material',
    meta: { title: 'Material' },
    component: Material
  },
  {
    path: '/material/edit/:id',
    meta: { title: 'Edit Material' },
    component: CreateMaterial
  },
  {
    path: '/material/create',
    meta: { title: 'Create Material' },
    component: CreateMaterial
  },
  {
    path: '/material/massupdate',
    meta: { title: 'Mass Update Material' },
    component: UpdateMaterial
  },
  {
    path: '/glass',
    meta: { title: 'Glass' },
    component: Glass
  },
  {
    path: '/glass/edit/:id',
    meta: { title: 'Edit Glass' },
    component: CreateGlass
  },
  {
    path: '/glass/create',
    meta: { title: 'Create Glass' },
    component: CreateGlass
  },
  {
    path: '/glass/massupdate',
    meta: { title: 'Mass Update Glass' },
    component: UpdateGlass
  },

]

const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("delica-token");
  let user = localStorage.getItem("data_user");

  if (to.path !== '/login' && to.path != '/register' && to.path != '/reset-password') {
    if (!token || !user) {
      store.dispatch("login/logout")
      next('/login')
    }  else {
      next()
    }
  } else {
    next()
  }

})
export default router;
