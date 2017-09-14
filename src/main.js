// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import routes from './utils/routes'
import User from './utils/user'
import auth from './auth'

Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(
            request.respondWith({
                status: 404,
                statusText: 'Oh no! Not found!'
            })
        );
    } else {
        next(
            request.respondWith(
                route.response,
                {
                    status: 200
                }
            )
        );
    }
});

Vue.config.productionTip = false

init();

function init() {
    auth.checkAuth();
    if (auth.isAuthenticated()) {
        return User.load()
        .then(() => {
            /* eslint-disable no-new */
            new Vue({
                el: '#app',
                router,
                template: '<App/>',
                components: {
                    App
                }
            });
        });
    }

    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: {
            App
        }
    });
}
