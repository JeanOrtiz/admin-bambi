import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
import { MAIN_LAYOUT } from './lib/constants'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                layout: MAIN_LAYOUT,
                title: 'Inicio'
            },
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            meta: {
                layout: MAIN_LAYOUT,
                title: 'Sobre ADM2'
            },
            component: () =>
                import('./views/About.vue')
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                isPublic: true,
                layout: 'auth-layout'
            },
            component: () => import('./views/Login.vue')
        },
        {
            path: '/registration',
            name: 'registration',
            meta: {
                isPublic: true,
                layout: 'auth-layout'
            },
            component: () => import('./views/Registration.vue')
        },
        {
            path: '/products',
            name: 'products',
            meta: { layout: MAIN_LAYOUT, title: 'Productos' },
            component: () => import('./views/Products.vue')
        },
        {
            path: '/inventories',
            name: 'inventories',
            meta: { layout: MAIN_LAYOUT, title: 'Inventarios' },
            component: () => import('./views/Inventories.vue')
        },
        {
            path: '/inventories/:id',
            name: 'inventory',
            meta: { layout: MAIN_LAYOUT, title: 'Inventario' },
            component: () => import('./views/Inventory.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            meta: { layout: MAIN_LAYOUT, title: 'Ajustes' },
            component: () => import('./views/Settings.vue')
        },
        {
            path: '/pos',
            name: 'pos',
            meta: { layout: MAIN_LAYOUT, title: 'Punto de Venta' },
            component: () => import('./views/Pos.vue')
        },
        {
            path: '/sales',
            name: 'sales',
            meta: { layout: MAIN_LAYOUT, title: 'Ventas' },
            component: () => import('./views/Sales.vue')
        },
        {
            path: '/employees',
            name: 'employees',
            meta: { layout: MAIN_LAYOUT, title: 'Empleados' },
            component: () => import('./views/Employees.vue')
        },
        {
            path: '/providers',
            name: 'providers',
            meta: { layout: MAIN_LAYOUT, title: 'Proveedores' },
            component: () => import('./views/Providers.vue')
        },
        {
            path: '/routes',
            name: 'routes',
            meta: { layout: MAIN_LAYOUT, title: 'Rutas' },
            component: () => import('./views/Routes.vue')
        },
        {
            path: '/customers',
            name: 'customers',
            meta: { layout: MAIN_LAYOUT, title: 'Clientes' },
            component: () => import('./views/Customers.vue')
        },
        {
            path: '/customers/:id',
            name: 'customer',
            meta: { layout: MAIN_LAYOUT, title: 'Cliente' },
            component: () => import('./views/Customer.vue')
        },
        {
            path: '/cashbox',
            name: 'cashbox',
            meta: { layout: MAIN_LAYOUT, title: 'Caja' },
            component: () => import('./views/Cashbox.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.isPublic || store.getters.isAuthenticated) {
        next()
    } else {
        store.getters.userCount.then(count => {
            if (count) {
                next({ name: 'login' })
            } else {
                next({ name: 'registration' })
            }
        })
    }

    // Clean Actio button state
    store.commit('SET_ACTION_BUTTONS', [])
})

export default router
