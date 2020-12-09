import Vue from 'vue'
import Vuex from 'vuex'
import { getUserCount } from './lib/auth'
import VuexPersistence from 'vuex-persist'
import Maths from './lib/maths'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

export default new Vuex.Store({
    state: {
        user: undefined,
        users: [],
        store: {},
        shoppingCart: [],
        shoppingCartCustomer: {},
        chartData: {},
        sidenavVisible: false,
        actionButtons: []
    },

    mutations: {
        /**
         * Set User
         * @param {Object} state state
         * @param {Object} user User
         */
        setUser(state, user) {
            state.user = user
        },

        SET_STORE(state, store) {
            state.store = store
        },

        TOGGLE_SIDENAV(state) {
            state.sidenavVisible = !state.sidenavVisible
        },

        /**
         * Add inventory product to shopping cart
         * @param {*} state
         * @param {*} inventoryProduct
         */
        ADD_PRODUCT_TO_SHOPPING_CART(state, payload) {
            state.shoppingCart = [...state.shoppingCart, payload]
        },

        /**
         * Remove Inventory Product form shopping cart
         * @param {*} state
         * @param {*} index
         */
        REMOVE_ITEM_SHOPPING_CART(state, index) {
            state.shoppingCart.splice(index, 1)
        },

        /**
         * Set the quantity of shopping cart
         * @param {Object} state Vuex state
         * @param {Object} payload Data
         */
        SET_PRODUCT_QTY_SHOPPING_CART(state, payload) {
            state.shoppingCart[payload.index].quantity = Number(
                payload.quantity
            )
            // Compute subtotal
            const qty = state.shoppingCart[payload.index].quantity
            const price =
                state.shoppingCart[payload.index].inventoryProduct.price

            const discount = state.shoppingCart[payload.index].discount || 0
            const discounted = Maths.getPercent(qty * price, discount)

            state.shoppingCart[[payload.index]].discounted = discounted

            state.shoppingCart[[payload.index]].subTotal =
                qty * price - discounted
        },

        SET_PRODUCT_DISCOUNT_SHOPPING_CART(state, payload) {
            // Compute subtotal
            const qty = state.shoppingCart[payload.index].quantity
            const price =
                state.shoppingCart[payload.index].inventoryProduct.price
            const subTotal = qty * price
            const discount = Number(payload.discount || 0)
            const discounted = Maths.getPercent(subTotal, discount) || 0

            state.shoppingCart[[payload.index]].discount = discount
            state.shoppingCart[[payload.index]].discounted = discounted
            state.shoppingCart[[payload.index]].subTotal = subTotal - discounted
        },

        /**
         * Increase by 1 the shopping cart product Quantity
         * @param {Object} state
         * @param {Number} index
         */
        INCREASE_PRODUCT_SHOPPING_CART(state, index) {
            state.shoppingCart[index].quantity++
            // Compute subtotal
            const qty = state.shoppingCart[index].quantity
            const price = state.shoppingCart[index].inventoryProduct.price
            const discount = state.shoppingCart[index].discount || 0
            const discounted = Maths.getPercent(price * qty, discount) || 0

            console.log(discount, discounted)

            state.shoppingCart[[index]].subTotal = qty * price - discounted
        },

        SET_SHOPPING_CART_CUSTOMER(state, payload) {
            state.shoppingCartCustomer = payload
        },

        CLEAR_SHOPPING_CART(state) {
            state.shoppingCart = []
        },

        // CHART DATA
        SET_CHART_DATA(state, payload) {
            state.chartData = payload
        },

        SET_ACTION_BUTTONS(state, payload) {
            state.actionButtons = payload
        }
    },

    actions: {
        LOGOUT(context) {
            context.commit('setUser', undefined)
        }
    },

    getters: {
        userCount() {
            return getUserCount()
        },

        isAuthenticated: state => {
            return state.user != undefined
        },

        store: state => {
            return state.store
        },

        /**
         * Sum all subtotals
         */
        shoppingCartTotal: state => {
            return state.shoppingCart.reduce((val, obj) => {
                return val + obj.subTotal
            }, 0)
        },

        currency: state => state.store.currency || '$'
    },

    plugins: [vuexLocal.plugin]
})
