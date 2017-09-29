import Router from 'vue-router'
import Home from '@/components/Home'
import Stage1 from '@/components/Stage1'
import Stage2 from '@/components/Stage2'
import Stage3 from '@/components/Stage3'
import Stage4 from '@/components/Stage4'
import Stage5 from '@/components/Stage5'
import Stage6 from '@/components/Stage6'
import Stage7 from '@/components/Stage7'

import auth from '@/utils/auth'
import User from '@/utils/user'
import config from '@/utils/config'

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/stage/1',
        name: 'Stage1',
        component: Stage1,
        beforeEnter: function(to, from, next) {
            return beforeStage(1, next);
        }
    },
    {
        path: '/stage/2',
        name: 'Stage2',
        component: Stage2,
        beforeEnter: function(to, from, next) {
            return beforeStage(2, next);
        }
    },
    {
        path: '/stage/3',
        name: 'Stage3',
        component: Stage3,
        beforeEnter: function(to, from, next) {
            return beforeStage(3, next);
        }
    },
    {
        path: '/stage/4',
        name: 'Stage4',
        component: Stage4,
        beforeEnter: function(to, from, next) {
            return beforeStage(4, next);
        }
    },
    {
        path: '/stage/5',
        name: 'Stage5',
        component: Stage5,
        beforeEnter: function(to, from, next) {
            return beforeStage(5, next);
        }
    },
    {
        path: '/stage/6',
        name: 'Stage6',
        component: Stage6,
        beforeEnter: function(to, from, next) {
            return beforeStage(6, next);
        }
    },
    {
        path: '/stage/7',
        name: 'Stage7',
        component: Stage7,
        beforeEnter: function(to, from, next) {
            return beforeStage(7, next);
        }
    },
    {
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
                    return this.$http.get(`${config.apiUrl}/api/v1/verify/email/${code}`);
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
        path: '/oauth2/callback',
        component: Home,
        props: () => {
            return { awaitingAuthentication: true };
        }
    }, {
        path: '*',
        redirect: '/'
    }]
});

function beforeStage(stageIndex, next) {
    if (!auth.hasSessionSet()) {
        return next('/');
    }
    auth.isReady()
    .then(() => {
        const user = User.get();
        if (!user) {
            return next('/');
        }
        if (user.isAllowed(stageIndex)) {
            return next();
        }

        stageIndex = user.getCurrentStage().stage;
        return next(`/stage/${stageIndex}`);
    });
}

export default router
