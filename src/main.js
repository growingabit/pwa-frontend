// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(VueResource);

import App from './App'
import router from './router'
import auth from './auth'

Vue.config.productionTip = false;

Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'white'
});

init();

function init() {
    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: {
            App
        },
        created: () => auth.checkAuth()
    });
}
