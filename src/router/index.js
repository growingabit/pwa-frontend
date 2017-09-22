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
            if (!auth.isAuthenticatedSync()) {
                return next('/');
            }

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
        path: '/verify/email/:codeBase64',
        component: {
            template: '',
            mounted: function() {
                console.log(this.$route.params.codeBase64);
            }
        }
    }, {
        path: '*',
        redirect: '/'
    }]
});

export default router
