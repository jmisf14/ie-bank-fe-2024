import Vue from 'vue'
import VueRouter from 'vue-router'
import Skull from '../components/Skull.vue'
import AppAccounts from '../components/AppAccounts.vue'
import Home from '../components/Home.vue'
import AccountDetails from '../components/AccountDetails.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/skull',
    name: 'Skull',
    component: Skull
  },
  {
    path: '/accounts',
    name: 'AppAccounts',
    component: AppAccounts
  },
  {
    path: '/accounts/:id',
    name: 'AccountDetails',
    component: AccountDetails,
    props: true // Allows passing route params as props to the component
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
