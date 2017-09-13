import Vue from 'vue'
import VueMaterial from 'vue-material'
import Router from 'vue-router'
import Home from '@/components/Home'


Vue.use(Router)
Vue.use(VueMaterial)


Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'grey'
})

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }]
})
