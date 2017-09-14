import Vue from 'vue'
import VueMaterial from 'vue-material'
import Router from 'vue-router'
import Home from '@/components/Home'
import auth from '@/auth'
import User from '@/utils/user'


Vue.use(Router)
Vue.use(VueMaterial)


Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'grey'
})

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/stage/:stageid',
        name: 'Home',
        component: Home,
        beforeEnter: function(to, from, next) {
            const user = User.get();
            if (user.isAllowed(to.params.stageid)) {
                return next();
            }
            return next('/stage/0')
        }
    }]
});


router.beforeEach((to, from, next) => {
    auth.checkAuth();
    if (!to.matched.some(record => record.meta.protected)) {
        return next();
    }
    if (auth.isAuthenticated()) {
        return next();
    }
    next('/');
});

export default router
