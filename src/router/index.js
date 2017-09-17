import Vue from 'vue'
import VueMaterial from 'vue-material'
import Router from 'vue-router'
import Home from '@/components/Home'
import Stages from '@/components/Stages'
import auth from '@/auth'
import User from '@/utils/user'

Vue.use(Router)
Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'white'
})

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: function(to, from, next) {            
            if (auth.isAuthenticated() && User.get()) {
                return next('/stage/0');
            }

            next();
        }
    }, {
        path: '/stage/:stageid',
        name: 'Stages',
        component: Stages,
        beforeEnter: function(to, from, next) {
            if (User.isAllowed(to.params.stageid)) {
                return next();
            }
            return next('/');
        }
    }, {
        path: '*',
        redirect: '/'
    }]
});

export default router
