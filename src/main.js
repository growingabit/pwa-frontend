// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import VueClipboards from 'vue-clipboards'

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueClipboards);

import App from '@/App'
import router from '@/router'
import auth from '@/utils/auth'

if (process.env.NODE_ENV === 'production') {
    Vue.config.productionTip = false;
    Vue.config.silent = true;
    if (window.location.href.indexOf('https') !== 0) {
        window.location.href = window.location.href.replace('http','https');
    }
}

Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'white'
});

init();

function init() {
    auth.init();

    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: {
            App
        }
    });
}
