import Router from 'vue-router'
import Home from '@/components/Home'
import Stages from '@/components/Stages'
import auth from '@/auth'
import User from '@/utils/user'

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/stage/:stageid',
        name: 'Stages',
        component: Stages,
        beforeEnter: function(to, from, next) {
            auth.isReady()
            .then(() => {
                const user = User.get();
                if (!user) {
                    return next('/');
                }

                if (user.isAllowed(Number(to.params.stageid) - 1)) {
                    return next();
                }

                const stageIndex = user.getCurrentStage().stage;
                return next(`/stage/${stageIndex}`);
            });
        }
    }, {
        path: '*',
        redirect: '/'
    }]
});

export default router
