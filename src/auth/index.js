import Vue from 'vue'
import Auth0Lock from "auth0-lock"
import EventEmitter from 'eventemitter3'
import router from '@/router'
import User from '@/utils/user'

const lock = new Auth0Lock("hxKGbiVdlGwuG0JcWkB1FG9rGYUIXsJO", "growbit.auth0.com", {
    auth: {
        redirectUrl: 'http://localhost:8080/oauth2/callback',
        responseType: 'token'
    }
});

let token;

class Auth extends EventEmitter {
    login() {
        lock.show();
    }

    signup() {
        lock.show();
    }

    logout() {
        localStorage.removeItem('idToken');
        token = null;
        auth.emit('logout');
    }

    setToken(idToken) {
        localStorage.setItem('idToken', idToken);
        Vue.http.headers.common['Authorization'] = getAuthHeader();
        token = idToken;
    }

    checkAuth() {
        token = localStorage.getItem('idToken');
        Vue.http.headers.common['Authorization'] = getAuthHeader();
    }

    isAuthenticated() {
        return !!token;
    }
}

const auth = new Auth();

export default auth;

// Listen for the authenticated event and get profile
lock.on("authenticated", function(authResult) {
    auth.setToken(authResult.idToken)
    User.load()
    .then(() => {
        router.push('/stage/0');
    });
});

function getAuthHeader() {
    if (token) {
        return `Bearer ${token}`;
    }

    return '';
}
