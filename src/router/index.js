import Router from 'vue-router'
import Home from '@/components/Home'
import Stages from '@/components/Stages'
import auth from '@/utils/auth'
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
            if (!auth.hasSessionSet()) {
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
            template: '<span></span>',
            mounted: function() {
                const code = this.$route.params.codeBase64;
                if (!code || !auth.hasSessionSet()) {
                    return this.$router.push('/');
                }

                auth.isReady()
                .then(() => {
                    return this.$http.get(`http://127.0.0.1:8080/api/v1/verify/email/${code}`);
                })
                .then((res) => {
                    console.log(res);
                    this.$router.push('/');
                })
                .catch((err) => {
                    console.log(err);
                    this.$router.push('/');
                });
            }
        }
    }, {
        path: '*',
        redirect: '/'
    }]
});

export default router
